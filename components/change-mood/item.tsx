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
import { SPRING_CONFIG, SPRING_CONFIG_BOUNCE, useChangeMood } from "./provider";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { SharedValue } from "react-native-gesture-handler/src/v3/types";
import { ArrowUp } from "lucide-react-native";
import { FontAwesome6 } from "@expo/vector-icons";

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
      width: withSpring(width, SPRING_CONFIG_BOUNCE),
      height: withSpring(height, SPRING_CONFIG_BOUNCE),
    };
  });

  const animatedProgress = useDerivedValue(() => {
    return withSpring(isCollapsed.value ? 0 : 1, SPRING_CONFIG_BOUNCE);
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
      opacity: withSpring(isCollapsed.value ? 0 : 1, SPRING_CONFIG_BOUNCE),
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
        <Content />
        <Arrow tintColor={tintColor} isSelected={isSelected} size={size} />
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
      width: withSpring(
        isCollapsed.value
          ? (collapsedSize?.width ?? 0) / 2
          : (size?.width ?? 0) / 2,
        SPRING_CONFIG_BOUNCE,
      ),
    };
  });

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(
        isCollapsed.value ? (collapsedSize?.height ?? 0) : (size?.height ?? 0),
        SPRING_CONFIG_BOUNCE,
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
}: {
  tintColor?: string;
  isSelected: SharedValue<boolean>;
  size?: Dimensions;
}) => {
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isSelected.value ? 1 : 0, SPRING_CONFIG_BOUNCE),
        },
      ],
      opacity: withSpring(isSelected.value ? 1 : 0, SPRING_CONFIG),
    };
  });

  return (
    <View style={[styles.arrowWrapper, { height: size?.height }]}>
      <Animated.View style={[styles.arrow, iconAnimatedStyle]}>
        <FontAwesome6 name="arrow-up" size={28} color={tintColor} />
      </Animated.View>
    </View>
  );
};

const Content = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Content</Text>
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
});
