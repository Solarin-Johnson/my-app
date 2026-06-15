import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useFloatingMenu } from "./provider";

export default function Overlay() {
  const { isOpened } = useFloatingMenu();
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isOpened ? 0.9 : 0),
  }));
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: "black" },
        animatedStyle,
      ]}
    />
  );
}
