import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Image, ImageSource } from "expo-image";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import { ItemChildType } from "../floating-gesture-menu/item";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { AnimatedText } from "../ui/animated-text";
import { opacity } from "react-native-redash";
import { useFloatingMenu } from "../floating-gesture-menu/provider";
import { EaseView } from "react-native-ease";

type MenuItemType = {
  text: string;
  image: ImageSource;
} & Partial<ItemChildType>;

export const SPRING_CONFIG = {
  damping: 20,
  mass: 0.4,
  stiffness: 150,
};
export const SPRING_CONFIG_REVEAL = {
  damping: 12,
  mass: 0.6,
  stiffness: 220,
};

const ITEM_HEIGHT = 64;

const applySpring = (value: number) => {
  "worklet";
  return withSpring(value, SPRING_CONFIG);
};

export default function MenuItem({
  image,
  text,
  active,
  hovered,
  index = 0,
}: MenuItemType) {
  const { state, hoveredIndex, totalItems, isOpened, bottomInset } =
    useFloatingMenu();
  const textAnmatedStyle = useAnimatedStyle(() => {
    console.log(text, active?.get(), hovered?.get());
    const activeHold =
      active?.get() && !hovered?.get() && state.get() === "holding";

    return {
      opacity: activeHold ? 0.5 : 1,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const hoveredIdx = hoveredIndex.get();
    const isHovered = hoveredIdx == null || hoveredIdx === index;
    console.log(hoveredIndex.get(), "h");

    return {
      transform: [{ scale: applySpring(hovered?.get() ? 1.15 : 1) }],
      opacity: applySpring(isHovered ? 1 : 0.7),
    };
  });

  console.log(text, index);

  return (
    <EaseView
      animate={{
        translateY: isOpened
          ? 0
          : (totalItems - 1 - index) * ITEM_HEIGHT + bottomInset * 1.5,
        opacity: isOpened ? 1 : 0.7,
      }}
      transition={{ type: "spring", ...SPRING_CONFIG }}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <ThemedTextWrapper
          style={styles.text}
          type="semiBold"
          ignoreStyle={false}
          colorName="white"
        >
          <Animated.Text style={textAnmatedStyle}>{text}</Animated.Text>
        </ThemedTextWrapper>
        <Image source={image} style={styles.image} contentFit="contain" />
      </Animated.View>
    </EaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    // paddingVertical: 6,
    transformOrigin: "right",
    height: ITEM_HEIGHT,
    // backgroundColor: "red",
  },
  text: {
    fontSize: 18,
    letterSpacing: -0.2,
    fontFamily: "system",
    fontWeight: 600,
  },
  image: {
    width: 36,
    aspectRatio: 1,
    borderRadius: 9,
    borderCurve: "continuous",
  },
});
