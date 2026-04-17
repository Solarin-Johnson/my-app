import { View, Text } from "react-native";
import React from "react";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type BubbleProps = {
  emoji: string;
  popping: SharedValue<boolean>;
};

const MAX_BUBBLE_DURATION = 3000;
const BUBBLE_MIN_SIZE = 30;
const BUBBLE_MAX_SIZE = 100;

const ROTATION_FACTOR = 3;
const ROTATION_DURATION = 30;

export default function Bubble({ emoji, popping }: BubbleProps) {
  const timer = useSharedValue(0);

  useAnimatedReaction(
    () => popping.value,
    (isPopping) => {
      if (isPopping) {
        timer.value = 0;

        timer.value = withTiming(MAX_BUBBLE_DURATION, {
          duration: MAX_BUBBLE_DURATION,
        });
      } else {
        cancelAnimation(timer);
        timer.value = 0;
      }
    },
  );

  const progress = useDerivedValue(() => {
    return timer.value / MAX_BUBBLE_DURATION;
  });

  const rotation = useDerivedValue(() => {
    if (!popping.value) return 0;
    return withRepeat(
      withTiming(1, { duration: ROTATION_DURATION, easing: Easing.linear }),
      -1,
      true,
    );
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const burst = progress.value >= 1 && popping.value;
    console.log(rotation.value);

    const size =
      burst || !popping.value
        ? 1
        : BUBBLE_MIN_SIZE +
          (BUBBLE_MAX_SIZE - BUBBLE_MIN_SIZE) * progress.value;
    const r = interpolate(rotation.value, [0, 0.5, 1], [-1, 0, 1]);

    return {
      fontSize: size,
      transform: [
        {
          rotateZ: `${r * ROTATION_FACTOR}deg`,
        },
      ],
    };
  });

  return (
    <View>
      <Animated.Text style={textAnimatedStyle}>{emoji}</Animated.Text>
    </View>
  );
}
