import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { cloneElement, ReactElement } from "react";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "semiBold" | "subtitle" | "regular" | "bold" | "italic";
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  colorName = "text",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(colorName, {
    light: lightColor,
    dark: darkColor,
  });
  const textColor = { color };

  return <Text style={[textColor, styles[type], style]} {...rest} />;
}

export function ThemedTextWrapper({
  children,
  lightColor,
  darkColor,
  type = "default",
  colorName = "text",
  style,
  ignoreStyle = true,
  ...rest
}: ThemedTextProps & { children: ReactElement<any>; ignoreStyle?: boolean }) {
  const color = useThemeColor(colorName, {
    light: lightColor,
    dark: darkColor,
  });
  const textColor = { color };

  const combinedStyle = [textColor, !ignoreStyle && styles[type], style];

  return cloneElement(children, {
    style: [(children.props as any).style ?? {}, ...combinedStyle],
    color,
    ...rest,
  });
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    fontFamily: "InterMedium",
  },
  semiBold: {
    fontSize: 17,
    fontFamily: "InterSemiBold",
  },
  bold: {
    fontSize: 17,
    fontFamily: "InterBold",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter",
  },
  regular: {
    fontSize: 14,
    fontFamily: "InterRegular",
  },
  italic: {
    fontSize: 16,
    fontFamily: "LoraMediumItalic",
  },
});
