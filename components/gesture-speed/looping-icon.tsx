import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { SharedValue } from "react-native-gesture-handler/lib/typescript/v3/types";
import { ThemedTextWrapper } from "../ThemedText";

type LoopingIconProps = {
  speed?: SharedValue<number>;
  iconSize?: number;
};

const SCALE_MIN = 0.8;
const OPACITY_MIN = 0.5;

const getMin = (value: number, min: number) => {
  "worklet";
  return min + value * (1 - min);
};

const voidTiming = (v: number) => {
  "worklet";
  return withTiming(v, { duration: 0 });
};

export default function LoopingIcon({
  speed: _speed,
  iconSize = 16,
}: LoopingIconProps) {
  const speed = useDerivedValue(() => {
    return 500 / Math.sqrt(_speed?.value || 1);
  });

  const progress = useDerivedValue(() => {
    return withRepeat(
      withSequence(
        withTiming(0, { duration: speed.value }),
        withTiming(1, { duration: speed.value }),
      ),
      -1,
    );
  });

  const useCreateAnimatedStyle = (delayed?: boolean) => {
    return useAnimatedStyle(() => {
      const delay = delayed ? speed.value / 4 : 0;
      const minO = getMin(progress.value, OPACITY_MIN);
      const minS = getMin(progress.value, SCALE_MIN);
      const o = withDelay(delay, voidTiming(minO));
      const s = withDelay(delay, voidTiming(minS));
      return {
        opacity: o,
        transform: [
          {
            scale: s,
          },
        ],
      };
    });
  };

  const icon1animatedStyle = useCreateAnimatedStyle();
  const icon2animatedStyle = useCreateAnimatedStyle(true);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.icon, icon1animatedStyle]}>
        <ThemedTextWrapper>
          <Ionicons name="play" size={iconSize} />
        </ThemedTextWrapper>
      </Animated.View>
      <Animated.View style={[styles.icon, icon2animatedStyle]}>
        <ThemedTextWrapper>
          <Ionicons name="play" size={iconSize} />
        </ThemedTextWrapper>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginHorizontal: -3,
  },
});
