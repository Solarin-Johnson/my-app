import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { GlassView } from "expo-glass-effect";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useChangeMood } from "./provider";
import { SPRING_CONFIG } from "@/constants";

export type Dimensions = {
  width: number;
  height: number;
};

type ItemProps = {
  tintColor?: string;
  index?: number;
  expandedSize?: Dimensions;
  size?: Dimensions;
  collapsedSize?: Dimensions;
};

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

export default function Item({
  tintColor,
  expandedSize,
  size,
  collapsedSize,
  index,
}: ItemProps) {
  const { currentIndex, goToIndex } = useChangeMood();
  const animatedStyle = useAnimatedStyle(() => {
    const isIdle = currentIndex.value === 0;
    const isSelected = currentIndex.value === index;
    const defaultW = size?.width ?? 0;
    const defaultH = size?.height ?? 0;
    const expandedW = expandedSize?.width ?? defaultW;
    const expandedH = expandedSize?.height ?? defaultH;
    const collapsedW = collapsedSize?.width ?? defaultW;
    const collapsedH = collapsedSize?.height ?? defaultH;

    const width = isIdle ? defaultW : isSelected ? expandedW : collapsedW;
    const height = isIdle ? defaultH : isSelected ? expandedH : collapsedH;

    return {
      width: withSpring(width, SPRING_CONFIG),
      height: withSpring(height, SPRING_CONFIG),
    };
  });

  return (
    <AnimatedGlassView
      style={[
        styles.glass,
        { width: size?.width, height: size?.height },
        animatedStyle,
      ]}
      tintColor={tintColor}
      glassEffectStyle="regular"
      // isInteractive
      colorScheme="dark"
    >
      <Pressable
        style={[
          styles.item,
          styles.gradient,
          {
            // backgroundColor: tintColor,
          },
        ]}
        onPress={() => {
          index && goToIndex(index);
        }}
      ></Pressable>
    </AnimatedGlassView>
  );
}

const styles = StyleSheet.create({
  glass: {
    borderRadius: 999,
    width: 60,
    height: 100,
    borderCurve: "continuous",
  },
  item: {
    flex: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  gradient: {
    experimental_backgroundImage:
      "linear-gradient(to bottom, #ffffff50, #00000000)",
  },
});
