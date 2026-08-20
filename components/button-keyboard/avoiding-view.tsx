import { StyleSheet, Text, View, ViewProps } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useButtonKeyboard } from "./provider";
import { SPRING_CONFIG } from "./pad";

type AvoidingViewProps = ViewProps & {
  bottomOffset?: number;
};

export default function AvoidingView({
  children,
  style,
  bottomOffset = 0,
  ...props
}: AvoidingViewProps) {
  const { keyboardHeight, isKeyboardOpened } = useButtonKeyboard();
  const flattenedStyle = StyleSheet.flatten(style);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      marginBottom: withSpring(
        isKeyboardOpened.value
          ? keyboardHeight.value + bottomOffset
          : Number(
              flattenedStyle?.marginBottom || flattenedStyle?.marginVertical,
            ) || 0,
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
