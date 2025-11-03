import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedRef,
  measure,
  SharedValue,
  useAnimatedReaction,
  EasingFunction,
  Easing,
} from "react-native-reanimated";
import { useEffect, ReactNode } from "react";
import { scheduleOnUI } from "react-native-worklets";

type ShimmerProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  color?: string;
  isPlaying?: SharedValue<boolean>;
  rotateDeg?: `${string}deg`;
  duration?: number;
  easing?: EasingFunction;
};

const Shimmer = ({
  children,
  style,
  color = "#FFFFFF",
  isPlaying,
  rotateDeg = "45deg",
  duration = 1500,
  easing = Easing.inOut(Easing.ease),
}: ShimmerProps) => {
  const shimmerProgress = useSharedValue(1);
  const width = useSharedValue(0);
  const containerRef = useAnimatedRef<View>();

  useEffect(() => {
    scheduleOnUI(() => {
      const m = measure(containerRef);
      if (m) {
        width.value = m.width;
      }
    });
    return () => {
      shimmerProgress.value = 0;
    };
  }, []);

  useAnimatedReaction(
    () => isPlaying?.value,
    (playing, prevPlaying) => {
      if (playing === prevPlaying || !isPlaying) return;
      if (playing) {
        shimmerProgress.value = withRepeat(
          withTiming(0, { duration, easing }),
          -1,
          false
        );
      } else {
        shimmerProgress.value = 1;
      }
    }
  );

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: width.value === 0 ? 0 : 1,
      transform: [
        { rotate: rotateDeg },
        { translateY: (1.8 * shimmerProgress.value - 1) * width.value },
      ],
    };
  });

  const transparentHex = (hex: string) => {
    if (hex.length === 9) return hex.slice(0, 7) + "00";
    if (hex.length === 7) return hex + "00";
    return hex;
  };

  return (
    <Animated.View ref={containerRef} style={[styles.container, style]}>
      {children}
      <Animated.View
        style={[
          styles.shimmer,
          {
            experimental_backgroundImage: `linear-gradient(${transparentHex(
              color
            )} 0%, ${color} 50%, ${transparentHex(color)} 100%)`,
          },
          shimmerAnimatedStyle,
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    // backgroundColor: "red",
  },
  shimmer: {
    position: "absolute",
    width: "150%",
    height: "40%",
    left: "-25%",
    top: "30%",
  },
});

export default Shimmer;
