import { Feedback } from "@/functions";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withSpring,
  withTiming,
  withDecay,
  useAnimatedReaction,
  measure,
  useAnimatedRef,
  Extrapolation,
  useDerivedValue,
} from "react-native-reanimated";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";

type SliderProps = {
  value?: SharedValue<number>;
  max?: number;
  trackColor?: string;
  thumbColor?: string;
  pressed?: SharedValue<boolean>;
  scrubbing?: SharedValue<boolean>;
};

const isWeb = Platform.OS === "web";

const TRACK_HEIGHT = 8;
const EXPANDED_TRACK_HEIGHT = 14;
const VELOCITY_RESISTANCE = isWeb ? 0.2 : 0.8;
const MAX_OVERDRAG = 12;
const OVERDRAG_RESISTANCE = 0.1;

export default function Slider({
  value: externalValue,
  max = 100,
  thumbColor = "#007AFF",
  trackColor = "#CCCCCC",
  pressed: externalPressed,
  scrubbing: externalScrubbing,
}: SliderProps) {
  const defaultValue = useSharedValue(0);
  const value = externalValue || defaultValue;
  const startValue = useSharedValue(0);
  const pressed = useSharedValue(false);
  const overDrag = useSharedValue(0);
  const trackRef = useAnimatedRef();
  const sliderWidth = useSharedValue(0);
  const defaultScrubbing = useSharedValue(false);
  const scrubbing = externalScrubbing || defaultScrubbing;

  useAnimatedReaction(
    () => pressed.value,
    (current) => {
      if (externalPressed) {
        externalPressed.value = current;
      }
    }
  );

  const HapticFeedback = () => {
    Feedback.selection();
  };

  useAnimatedReaction(
    () => {
      const atEdge = value.value === 0 || value.value === max;
      const atMaxOverDrag = Math.abs(overDrag.value) >= MAX_OVERDRAG;
      return { atEdge, atMaxOverDrag };
    },
    (current, previous) => {
      if (
        (current.atEdge && !previous?.atEdge) ||
        (current.atMaxOverDrag && !previous?.atMaxOverDrag)
      ) {
        scheduleOnRN(HapticFeedback);
      }
    }
  );

  const panGesture = Gesture.Pan()
    .onTouchesDown(() => {
      pressed.value = true;
      scrubbing.value = true;
    })
    .onTouchesUp(() => {
      pressed.value = false;
    })
    .onTouchesCancelled(() => {
      pressed.value = false;
      scrubbing.value = false;
    })
    .onStart(() => {
      startValue.value = value.value;
    })
    .onUpdate((e) => {
      const fraction = e.translationX / sliderWidth.value;
      let newValue = startValue.value + fraction * max;

      if (newValue < 0 || newValue > max) {
        const overflowFraction =
          newValue < 0 ? newValue / max : (newValue - max) / max;

        const px = overflowFraction * sliderWidth.value;

        overDrag.value = Math.max(
          -MAX_OVERDRAG,
          Math.min(px * OVERDRAG_RESISTANCE, MAX_OVERDRAG)
        );
      } else {
        overDrag.value = 0;
      }

      newValue = Math.max(0, Math.min(max, newValue));
      value.value = newValue;
    })
    .onEnd((e) => {
      const normalizedVelocity = (e.velocityX / sliderWidth.value) * max;

      if (value.value > 0 && value.value < max) {
        value.value = withDecay(
          {
            velocity: normalizedVelocity * VELOCITY_RESISTANCE,
            deceleration: 0.995,
            clamp: [0, max],
          },
          () => {
            scrubbing.value = false;
          }
        );
      }

      overDrag.value = withSpring(0);
    })
    .onFinalize(() => {
      pressed.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        value.value,
        [0, max],
        [0, sliderWidth.value],
        Extrapolation.CLAMP
      ),
      height: EXPANDED_TRACK_HEIGHT,
    };
  });

  const animatedHeightStyle = useAnimatedStyle(() => {
    const clampedOverDrag = overDrag.value;
    const absDrag = Math.abs(clampedOverDrag);

    return {
      height: withTiming(pressed.value ? EXPANDED_TRACK_HEIGHT : TRACK_HEIGHT, {
        duration: 200,
      }),
      transform: [
        {
          translateX:
            clampedOverDrag / 2 +
            interpolate(
              absDrag,
              [0, MAX_OVERDRAG],
              [0, Math.sign(overDrag.value) * (MAX_OVERDRAG / 4)]
            ),
        },
        {
          scaleX: 1 + absDrag / sliderWidth.value,
        },
        {
          scaleY:
            1 -
            Math.min(
              0.15,
              Math.abs(overDrag.value) / (EXPANDED_TRACK_HEIGHT * 4)
            ),
        },
      ],
    };
  });

  const measureSlider = () => {
    scheduleOnUI(() => {
      const m = measure(trackRef);
      if (m) {
        sliderWidth.value = m.width;
      }
    });
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={{
          height: EXPANDED_TRACK_HEIGHT * 2,
          justifyContent: "center",
          width: "100%",
        }}
        ref={trackRef}
        onLayout={measureSlider}
      >
        <Animated.View
          style={[
            styles.track,
            {
              backgroundColor: trackColor,
            },
            animatedHeightStyle,
          ]}
        >
          <Animated.View
            style={[
              {
                backgroundColor: thumbColor,
              },
              animatedStyle,
            ]}
            collapsable={false}
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    borderRadius: EXPANDED_TRACK_HEIGHT / 2,
    backgroundColor: "#eee",
    overflow: "hidden",
    borderCurve: "continuous",
  },
});
