import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Image, ImageSource } from "expo-image";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import { ItemChildType } from "../floating-gesture-menu/item";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { AnimatedText } from "../ui/animated-text";
import { opacity } from "react-native-redash";
import { useFloatingMenu } from "../floating-gesture-menu/provider";

type MenuItemType = {
  text: string;
  image: ImageSource;
} & Partial<ItemChildType>;

export default function MenuItem({
  image,
  text,
  active,
  hovered,
}: MenuItemType) {
  const { state, hoveredIndex} = useFloatingMenu();
  const textAnmatedStyle = useAnimatedStyle(() => {
    console.log(text, active?.get(), hovered?.get());
    const activeHold =
      active?.get() && !hovered?.get() && state.get() === "holding";

    return {
      opacity: activeHold ? 0.5 : 1,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
        transform: [{ scale: hovered?.get() ? 1.1 : 1 }],
        opacity:
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ThemedTextWrapper style={styles.text}>
        <Animated.Text style={textAnmatedStyle}>{text}</Animated.Text>
      </ThemedTextWrapper>
      <Image source={image} style={styles.image} contentFit="cover" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 8,
    transformOrigin: "right",
  },
  text: {
    fontSize: 19,
    letterSpacing: -0.23,
  },
  image: {
    width: 36,
    aspectRatio: 1,
    borderRadius: 8,
  },
});
