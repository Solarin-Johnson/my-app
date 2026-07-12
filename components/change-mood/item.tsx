import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
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
import { ArrowUp } from "lucide-react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { size } from "@shopify/react-native-skia";

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
}: ItemProps) {
  const { currentIndex, goToIndex } = useChangeMood();

  const isCollapsed = useDerivedValue(() => {
    return currentIndex.value !== 0 && currentIndex.value !== index;
  });

  const isSelected = useDerivedValue(() => {
    return currentIndex.value === index;
  });

  const animatedStyle = useAnimatedStyle(() => {
    const isIdle = currentIndex.value === 0;
    const defaultW = size?.width ?? 0;
    const defaultH = size?.height ?? 0;
    const expandedW = expandedSize?.width ?? defaultW;
    const expandedH = expandedSize?.height ?? defaultH;
    const collapsedW = collapsedSize?.width ?? defaultW;
    const collapsedH = collapsedSize?.height ?? defaultH;

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
        <Shape
          isCollapsed={isCollapsed}
          size={size}
          collapsedSize={collapsedSize}
        />
        <Content expandedSize={expandedSize} isSelected={isSelected} />
        <Arrow
          tintColor={tintColor}
          isSelected={isSelected}
          size={size}
          expandedSize={expandedSize}
        />
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

const Shape = ({
  isCollapsed,
  size,
  collapsedSize,
}: {
  isCollapsed: SharedValue<boolean>;
  size?: Dimensions;
  collapsedSize?: Dimensions;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: applySpring(
        isCollapsed.value
          ? (collapsedSize?.width ?? 0) / 2
          : (size?.width ?? 0) / 2,
        "bounce",
      ),
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
      <Animated.View style={[styles.shape, animatedStyle]} />
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
      transform: [{ scale: applySpring(selected ? 1 : 0.8, "bounce") }],
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
        <ThemedText style={styles.text}>Emotions</ThemedText>
        <View style={styles.line} />
        <ThemedText style={styles.text}>Context</ThemedText>
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
    experimental_backgroundImage: "linear-gradient(170deg, #ffffff, #00000000)",
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
