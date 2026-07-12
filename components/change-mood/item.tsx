import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { ComponentType, ReactElement } from "react";
import { GlassView } from "expo-glass-effect";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  SPRING_CONFIG,
  SPRING_CONFIG_BOUNCE,
  SPRING_CONFIG_FAST,
  useChangeMood,
} from "./provider";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { SharedValue } from "react-native-gesture-handler/src/v3/types";
import { FontAwesome6 } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { Star5, Star5Rounded } from "../icons/star";
import { IconProps } from "../icons";

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
  shape?: ComponentType<IconProps>;
};

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const applySpring = (
  toValue: number,
  type: "fast" | "bounce" | "normal" = "normal",
  delay: number = 0,
) => {
  "worklet";
  let config = SPRING_CONFIG;
  if (type === "fast") {
    config = SPRING_CONFIG_FAST;
  } else if (type === "bounce") {
    config = SPRING_CONFIG_BOUNCE as any;
  }
  return withDelay(delay, withSpring(toValue, config));
};

const applyTiming = (
  toValue: number,
  type: "fast" | "normal" = "normal",
  delay: number = 0,
) => {
  "worklet";
  let config = {
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  };
  if (type === "fast") {
    config = {
      duration: 100,
      easing: Easing.inOut(Easing.cubic),
    };
  }
  return withDelay(delay, withTiming(toValue, config));
};

export default function Item({
  tintColor,
  expandedSize,
  size,
  collapsedSize,
  index,
  shape,
}: ItemProps) {
  const { currentIndex, goToIndex } = useChangeMood();

  const isCollapsed = useDerivedValue(() => {
    return currentIndex.value !== 0 && currentIndex.value !== index;
  });

  const isSelected = useDerivedValue(() => {
    return currentIndex.value === index;
  });

  const defaultW = size?.width ?? 0;
  const defaultH = size?.height ?? 0;
  const expandedW = expandedSize?.width ?? defaultW;
  const expandedH = expandedSize?.height ?? defaultH;
  const collapsedW = collapsedSize?.width ?? defaultW;
  const collapsedH = collapsedSize?.height ?? defaultH;

  const animatedStyle = useAnimatedStyle(() => {
    const isIdle = currentIndex.value === 0;

    const width = isIdle ? defaultW : isSelected.value ? expandedW : collapsedW;
    const height = isIdle
      ? defaultH
      : isSelected.value
        ? expandedH
        : collapsedH;

    return {
      width: applySpring(width, "bounce"),
      height: applySpring(height, "bounce"),
    };
  });

  const animatedProgress = useDerivedValue(() => {
    return applySpring(isCollapsed.value ? 0 : 1, "bounce");
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
    return {
      opacity: applySpring(isCollapsed.value ? 0 : 1, "bounce"),
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
      colorScheme="dark"
      animatedProps={animatedProps}
    >
      <Pressable
        pointerEvents={"auto"}
        style={[styles.item]}
        onPress={() => {
          index && goToIndex(index);
        }}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.gradient, innerAnimatedStyle]}
        />
        <Shape
          isCollapsed={isCollapsed}
          size={size}
          collapsedSize={collapsedSize}
        >
          {shape}
        </Shape>
        <Content expandedSize={expandedSize} isSelected={isSelected} />
        <Arrow
          tintColor={tintColor}
          isSelected={isSelected}
          size={size}
          expandedSize={expandedSize}
        />
      </Pressable>
    </AnimatedGlassView>
  );
}

const Shape = ({
  isCollapsed,
  size,
  collapsedSize,
  children: ShapeElement,
}: {
  isCollapsed: SharedValue<boolean>;
  size?: Dimensions;
  collapsedSize?: Dimensions;
  children?: ComponentType<IconProps>;
}) => {
  const shapeAnimatedStyle = useAnimatedStyle(() => {
    if (!size || !collapsedSize) return {};
    const scale = collapsedSize?.width / size?.width || 1;
    return {
      transform: [
        {
          scale: applySpring(isCollapsed.value ? scale : 1, "bounce"),
        },
      ],
    };
  });

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: applySpring(
        isCollapsed.value ? (collapsedSize?.height ?? 0) : (size?.height ?? 0),
        "bounce",
      ),
    };
  });
  return (
    <Animated.View
      style={[
        styles.shapeWrapper,
        {
          height: size?.height,
        },
        wrapperAnimatedStyle,
      ]}
    >
      <Animated.View style={[shapeAnimatedStyle]}>
        {ShapeElement ? (
          <ShapeElement size={(size?.width ?? 0) / 2} />
        ) : (
          <Animated.View style={styles.shape} />
        )}
      </Animated.View>
    </Animated.View>
  );
};

const Arrow = ({
  tintColor,
  isSelected,
  size,
  expandedSize,
}: {
  tintColor?: string;
  isSelected: SharedValue<boolean>;
  size?: Dimensions;
  expandedSize?: Dimensions;
}) => {
  const iconAnimatedStyle = useAnimatedStyle(() => {
    const selected = isSelected.value;
    return {
      transform: [
        {
          scale: applySpring(selected ? 1 : 0, "bounce"),
        },
      ],
      opacity: applyTiming(selected ? 1 : 0, "fast", selected ? 100 : 0),
    };
  });

  return (
    <View
      style={[
        styles.arrowWrapper,
        { height: (expandedSize?.width ?? 0) * 0.8 },
      ]}
    >
      <Animated.View style={[styles.arrow, iconAnimatedStyle]}>
        <FontAwesome6 name="arrow-up" size={28} color={tintColor} />
      </Animated.View>
    </View>
  );
};

const Content = ({
  expandedSize,
  isSelected,
}: {
  expandedSize?: Dimensions;
  isSelected: SharedValue<boolean>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const selected = isSelected.value;
    return {
      opacity: applyTiming(selected ? 1 : 0, "fast", selected ? 100 : 0),
      transform: [{ scale: applySpring(selected ? 1 : 0.8, "fast") }],
    };
  });
  return (
    <View
      style={[
        styles.contentWrapper,
        { top: (expandedSize?.height ?? 0) * -0.04 },
      ]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            width: (expandedSize?.width ?? 0) * 0.8,
            backgroundColor: "#ffffff20",
          },
          animatedStyle,
        ]}
      >
        <ThemedText style={styles.text} colorName="white">
          Emotions
        </ThemedText>
        <View style={styles.line} />
        <ThemedText style={styles.text} colorName="white">
          Context
        </ThemedText>
      </Animated.View>
    </View>
  );
};

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
    // justifyContent: "space-between",
    borderCurve: "continuous",
    overflow: "hidden",
  },
  gradient: {
    height: "70%",
    experimental_backgroundImage:
      "linear-gradient(to bottom, #ffffff40 , #00000000 )",
  },
  shape: {
    width: 28,
    aspectRatio: 1,
    borderRadius: "50%",
    experimental_backgroundImage: "radial-gradient(circle, #ffffff80, #ffffff)",
  },
  shapeWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    width: 54,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    experimental_backgroundImage:
      "linear-gradient(to bottom, #ffffff 20%, #ffffff80)",
  },
  arrowWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    // position: "absolute",
    height: 82,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 0.8,
    borderColor: "#ffffff50",
    borderCurve: "continuous",
  },
  contentWrapper: {
    height: 60,
    width: "100%",
    alignItems: "center",
  },
  line: {
    width: "70%",
    height: 1,
    marginVertical: 8,
    backgroundColor: "#ffffff50",
  },
  text: {
    fontFamily: "ui-rounded",
    fontWeight: "500",
  },
});
