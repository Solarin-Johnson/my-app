import { useEffect } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export type FadeLoopProps = {
  children: React.ReactNode;
  start?: SharedValue<boolean>;
  speed?: number;
};

const FadeLoop = ({ children, start, speed = 600 }: FadeLoopProps) => {
  const opacity = useDerivedValue(() => {
    if (start && !start.value) {
      return 1;
    }

    return withRepeat(
      withSequence(
        withTiming(1, { duration: speed }),
        withTiming(0, { duration: speed })
      ),
      -1,
      true
    );
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export default FadeLoop;
