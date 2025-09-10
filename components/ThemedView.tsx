import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { cloneElement } from "react";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  invert?: boolean;
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  invert,
  colorName = "background",
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(invert ? "text" : colorName, {
    light: lightColor,
    dark: darkColor,
  });

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ThemedViewWrapper({
  children,
  lightColor,
  darkColor,
  invert = false,
  colorName = "background",
  style,
  ...rest
}: ThemedViewProps & { children: React.ReactElement<any> }) {
  const backgroundColor = useThemeColor(invert ? "text" : colorName, {
    light: lightColor,
    dark: darkColor,
  });

  const combinedStyle = [{ backgroundColor }, style];

  return cloneElement(children, {
    style: [(children.props as any).style ?? {}, ...combinedStyle],
    ...rest,
  });
}
