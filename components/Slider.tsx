import { Feedback } from "@/functions";
import React from "react";
import { StyleSheet, View } from "react-native";
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
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type SliderProps = {
  value?: SharedValue<number>;
  max?: number;
  trackColor?: string;
  thumbColor?: string;
  pressed?: SharedValue<boolean>;
};

const SLIDER_WIDTH = 300;
const TRACK_HEIGHT = 8;
const EXPANDED_TRACK_HEIGHT = 16;
const VELOCITY_RESISTANCE = 0.1;
const MAX_OVERDRAG = 18;
const OVERDRAG_RESISTANCE = 0.25;

export default function Slider({
  value: externalValue,
  max = 100,
  thumbColor = "#007AFF",
  trackColor = "#CCCCCC",
  pressed: externalPressed,
}: SliderProps) {
  const value = externalValue || useSharedValue(0);
  const startValue = useSharedValue(0);
  const pressed = externalPressed || useSharedValue(false);
  const overDrag = useSharedValue(0);

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
    })
    .onTouchesUp(() => {
      pressed.value = false;
    })
    .onStart(() => {
      startValue.value = value.value;
    })
    .onUpdate((e) => {
      const fraction = e.translationX / SLIDER_WIDTH;
      let newValue = startValue.value + fraction * max;

      if (newValue < 0 || newValue > max) {
        const excess = newValue < 0 ? newValue : newValue - max;
        let rawOverDrag = excess * OVERDRAG_RESISTANCE;
        const clampedOverDrag = Math.max(
          -MAX_OVERDRAG,
          Math.min(rawOverDrag, MAX_OVERDRAG)
        );
        overDrag.value = clampedOverDrag;
      } else {
        overDrag.value = 0;
      }

      newValue = Math.max(0, Math.min(max, newValue));
      value.value = newValue;
    })
    .onEnd((e) => {
      value.value = withDecay({
        velocity: e.velocityX * VELOCITY_RESISTANCE,
        deceleration: 0.985,
        clamp: [0, max],
      });

      overDrag.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    console.log(overDrag.value);

    return {
      width: interpolate(value.value, [0, max], [0, SLIDER_WIDTH]),
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
          scaleX: 1 + absDrag / SLIDER_WIDTH,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={{
          height: EXPANDED_TRACK_HEIGHT * 2,
          justifyContent: "center",
        }}
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
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  track: {
    width: SLIDER_WIDTH,
    borderRadius: EXPANDED_TRACK_HEIGHT / 2,
    backgroundColor: "#eee",
    overflow: "hidden",
    borderCurve: "continuous",
  },
});
