import {
  DimensionValue,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from "react-native";
import React from "react";
import { useFloatingMenu } from "./provider";
import { EaseView } from "react-native-ease";

type ButtonContainerType = {
  removeDefaultStyle?: boolean;
  width?: number;
  left?: DimensionValue;
  right?: DimensionValue;
  top?: DimensionValue;
  bottom?: DimensionValue;
  height?: DimensionValue;
} & ViewProps;

type ButtonType = {
  removeDefaultStyle?: boolean;
  width?: number;
} & PressableProps;

export function ButtonContainer({
  children,
  style,
  top,
  bottom,
  right,
  left,
  height,
  ...props
}: ButtonContainerType) {
  const { bottomInset, isOpened } = useFloatingMenu();
  const positionStyle = {
    marginBottom: bottom,
    bottom: bottomInset,
    top,
    left,
    right,
    height,
  };

  const combinedStyle: ButtonContainerType["style"] = [
    positionStyle,
    style,
    styles.buttonContainer,
  ];

  return (
    <EaseView
      style={combinedStyle}
      animate={{ opacity: isOpened ? 1 : 0 }}
      pointerEvents={isOpened ? "auto" : "none"}
      transition={{ type: "timing" }}
      {...props}
    >
      {children}
    </EaseView>
  );
}
export function Button({
  children,
  width,
  removeDefaultStyle,
  style,
  ...props
}: ButtonType) {
  const { bottomInset, open, close, state, isOpened, position, resetPosition } =
    useFloatingMenu();

  const makeCombined = (s: any) => [
    !removeDefaultStyle && styles.defaultStyle,
    s,
  ];

  const combinedStyle: PressableProps["style"] =
    typeof style === "function"
      ? (pressState) => makeCombined(style(pressState))
      : makeCombined(style);

  return (
    <Pressable style={combinedStyle} {...props}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    zIndex: 1000,
    justifyContent: "center",
  },
  defaultStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 100,
  },
});
