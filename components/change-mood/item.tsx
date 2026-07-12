import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { GlassView } from "expo-glass-effect";
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { SPRING_CONFIG_BOUNCE, useChangeMood } from "./provider";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

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
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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
      width: withSpring(width, SPRING_CONFIG_BOUNCE),
      height: withSpring(height, SPRING_CONFIG_BOUNCE),
    };
  });

  const animatedProgress = useDerivedValue(() => {
    const isCollapsed =
      currentIndex.value !== 0 && currentIndex.value !== index;
    return withSpring(isCollapsed ? 0 : 1, SPRING_CONFIG_BOUNCE);
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      tintColor: interpolateColor(
        animatedProgress.value,
        [0, 1],
        ["#00000000", tintColor ?? "#00000000"],
      ),
    };
  });

  const innerAnimatedStyle = useAnimatedStyle(() => {
    const isCollapsed =
      currentIndex.value !== 0 && currentIndex.value !== index;

    return {
      opacity: withSpring(isCollapsed ? 0 : 1, SPRING_CONFIG_BOUNCE),
    };
  });

  return (
    <AnimatedGlassView
      style={[
        styles.glass,
        {
          width: size?.width,
          height: size?.height,
          boxShadow: `0px 0px 280px 8px ${tintColor ?? "#00000000"}`,
        },
        animatedStyle,
      ]}
      glassEffectStyle="clear"
      // isInteractive
      colorScheme="dark"
      animatedProps={animatedProps}
    >
      <AnimatedPressable
        pointerEvents={"auto"}
        style={[
          styles.item,
          {
            // backgroundColor: tintColor,
          },
        ]}
        onPress={() => {
          index && goToIndex(index);
        }}
      >
        {/* <Animated.View
          style={[StyleSheet.absoluteFill, styles.gradient, innerAnimatedStyle]}
        /> */}
        <AnimatedLinearGradient
          colors={["#ffffff40", tintColor + "00"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.7 }}
          style={[StyleSheet.absoluteFill, innerAnimatedStyle]}
        />
      </AnimatedPressable>
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
    overflow: "hidden",
  },
  gradient: {
    experimental_backgroundImage: "linear-gradient(170deg, #ffffff, #00000000)",
  },
});
