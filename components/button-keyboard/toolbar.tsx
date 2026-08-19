import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import React from "react";
import { useButtonKeyboard } from "./provider";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { SPRING_CONFIG } from "./pad";

type ToolbarProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function Toolbar({ children, style }: ToolbarProps) {
  const { isKeyboardOpened, keyboardHeight } = useButtonKeyboard();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      bottom: withSpring(
        isKeyboardOpened.value ? keyboardHeight.value : 0,
        SPRING_CONFIG,
      ),
      opacity: withSpring(isKeyboardOpened.value ? 1 : 0, SPRING_CONFIG),
    };
  });
  return (
    <Animated.View style={[styles.toolbar, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    position: "absolute",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    backgroundColor: "#00000010",
  },
});
