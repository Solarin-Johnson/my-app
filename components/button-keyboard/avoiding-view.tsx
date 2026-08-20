import { StyleSheet, Text, View, ViewProps } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useButtonKeyboard } from "./provider";
import { SPRING_CONFIG } from "./pad";

export default function AvoidingView({ children, style, ...props }: ViewProps) {
  const { keyboardHeight, isKeyboardOpened } = useButtonKeyboard();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      marginBottom: withSpring(
        isKeyboardOpened.value ? keyboardHeight.value : 0,
        SPRING_CONFIG,
      ),
    };
  });
  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({});
