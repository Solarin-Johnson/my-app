import { View, Text } from "react-native";
import React from "react";
import Animated, {
  cancelAnimation,
  Easing,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

export type BubbleProps = {
  emoji: string;
  popping?: SharedValue<boolean>;
  index: number;
  totalLength: number;
  onBurst?: () => void;
};

const MAX_BUBBLE_DURATION = 3000;
const BUBBLE_MIN_SIZE = 38;
const BUBBLE_MAX_SIZE = 100;

const ROTATION_FACTOR = 4;
const ROTATION_DURATION = 16;

const BUBBLE_POP_SCALE = 1.3;

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 240,
  mass: 0.8,
};

export default function Bubble({
  emoji,
  popping,
  index,
  totalLength,
  onBurst,
}: BubbleProps) {
  const timer = useSharedValue(0);
  const lockedProgress = useSharedValue(0);
  const burst = useSharedValue(false);

  const progress = useDerivedValue(() => {
    const linearProgress = timer.value / MAX_BUBBLE_DURATION;
    return Easing.out(Easing.quad)(linearProgress);
  });

  useAnimatedReaction(
    () => popping?.value,
    (isPopping) => {
      // if (index !== totalLength) return;
      if (isPopping) {
        // lockedProgress.value = 0;
        // burst.value = false;
        // timer.value = 0;

        timer.value = withTiming(
          MAX_BUBBLE_DURATION,
          { duration: MAX_BUBBLE_DURATION, easing: Easing.linear },
          (finished) => {
            if (finished && popping?.value) {
              burst.value = true;
            }
          },
        );
      } else {
        lockedProgress.value = progress.value;

        cancelAnimation(timer);
      }
    },
  );

  const rotation = useDerivedValue(() => {
    if (!popping?.value) return 0;
    return withRepeat(
      withSequence(
        withTiming(-1, { duration: ROTATION_DURATION, easing: Easing.linear }),
        withTiming(1, {
          duration: ROTATION_DURATION * 2,
          easing: Easing.linear,
        }),
      ),
      -1,
      true,
    );
  });

  useAnimatedReaction(
    () => burst.value,
    (b, prev) => {
      if (b && b !== prev && onBurst) {
        runOnJS(onBurst)();
      }
    },
  );

  const textAnimatedStyle = useAnimatedStyle(() => {
    const activeProgress = popping?.value
      ? progress.value
      : lockedProgress.value;

    const pop =
      lockedProgress.value > 0 &&
      lockedProgress.value <= 1 &&
      activeProgress > 0.2 &&
      !burst.value
        ? BUBBLE_POP_SCALE
        : 1;
    const PROGRESSING_SIZE =
      BUBBLE_MIN_SIZE + (BUBBLE_MAX_SIZE - BUBBLE_MIN_SIZE) * activeProgress;

    const size = burst.value
      ? BUBBLE_MIN_SIZE
      : pop
        ? withSpring(PROGRESSING_SIZE * pop, SPRING_CONFIG)
        : PROGRESSING_SIZE;

    const r = rotation.value;

    return {
      fontSize: size,
      transform: [
        {
          rotateZ: `${r * ROTATION_FACTOR}deg`,
        },
      ],
      opacity: burst.value ? 0 : 1,
    };
  });

  return (
    <View
      style={{
        paddingHorizontal: 16,
        // backgroundColor: "red",
      }}
    >
      <Animated.Text style={[{}, textAnimatedStyle]}>{emoji}</Animated.Text>
    </View>
  );
}
