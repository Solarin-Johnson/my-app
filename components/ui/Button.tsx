import React from "react";
import { Pressable, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { ThemedText, ThemedTextProps } from "../ThemedText";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  bgcolor?: string;
  color?: string;
  textProps?: ThemedTextProps;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  bgcolor = "#007bff",
  color = "#fff",
  textProps,
}) => {
  return (
    <Pressable
      style={[styles.button, { backgroundColor: bgcolor }, style]}
      onPress={onPress}
    >
      <ThemedText
        type="semiBold"
        style={[styles.text, { color }, textStyle]}
        {...textProps}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    borderRadius: 50,
    borderCurve: "continuous",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Button;
