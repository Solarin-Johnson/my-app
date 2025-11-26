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
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type SliderProps = {
  value?: SharedValue<number>;
  max?: number;
  steps?: number;
  onChange?: (value: number) => void;
  onComplete?: (value: number) => void;
};

const SLIDER_WIDTH = 300;
const TRACK_HEIGHT = 8;
const EXPANDED_TRACK_HEIGHT = 16;
const VELOCITY_RESISTANCE = 0.3;
const MAX_OVERDRAG = 20;
const RESISTANCE_FACTOR = 0.2;

const SPRING_CONFIG = {
  stiffness: 200,
  damping: 200,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
};

export default function Slider({
  value: externalValue,
  max = 100,
  steps = 100,
  onChange,
  onComplete,
}: SliderProps) {
  const value = externalValue || useSharedValue(0); // internal shared value
  const step = max / steps;
  const startValue = useSharedValue(0);
  const pressed = useSharedValue(false);
  const overDrag = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .hitSlop(100)
    .onTouchesDown(() => {
      pressed.value = true;
    })
    .onTouchesUp(() => {
      pressed.value = false;
    })
    .onStart(() => {
      startValue.value = value.value;
      pressed.value = true;
    })
    .onUpdate((e) => {
      pressed.value = true;

      const fraction = e.translationX / SLIDER_WIDTH;
      let newValue = startValue.value + fraction * max;

      if (newValue < 0) {
        overDrag.value = newValue * RESISTANCE_FACTOR;
      } else if (newValue > max) {
        overDrag.value = (newValue - max) * RESISTANCE_FACTOR;
      } else {
        overDrag.value = 0;
      }

      newValue = Math.max(0, Math.min(max, newValue));
      value.value = newValue;

      if (onChange) scheduleOnRN(onChange, newValue);
    })
    .onEnd((e) => {
      pressed.value = false;

      value.value = withDecay({
        velocity: ((e.velocityX * VELOCITY_RESISTANCE) / SLIDER_WIDTH) * max,
        clamp: [0, max],
      });
      overDrag.value = withSpring(0, SPRING_CONFIG);

      if (onComplete) scheduleOnRN(onComplete, value.value);
    });

  const animatedStyle = useAnimatedStyle(() => {
    console.log(overDrag.value);

    return {
      width: interpolate(value.value, [0, max], [0, SLIDER_WIDTH]),
      backgroundColor: "red",
      height: EXPANDED_TRACK_HEIGHT,
    };
  });

  const animatedHeightStyle = useAnimatedStyle(() => {
    const clampedOverDrag = Math.max(
      -MAX_OVERDRAG,
      Math.min(overDrag.value, MAX_OVERDRAG)
    );
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
              [0, Math.sign(overDrag.value) * (MAX_OVERDRAG / 3)]
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
        style={{ height: EXPANDED_TRACK_HEIGHT * 10, justifyContent: "center" }}
      >
        <Animated.View style={[styles.track, animatedHeightStyle]}>
          <Animated.View style={[animatedStyle]} collapsable={false} />
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
