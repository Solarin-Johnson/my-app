import { Text, type TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { cloneElement, ReactElement } from "react";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link" | "bold";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor("text", { light: lightColor, dark: darkColor });
  const variantKey = type as keyof typeof styles;

  return (
    <Text
      style={[{ color, fontFamily: "InterMedium" }, styles[variantKey], style]}
      {...rest}
    />
  );
}

export function ThemedTextWrapper({
  children,
  lightColor,
  darkColor,
  type = "default",
  style,
  ignoreStyle,
  ...rest
}: ThemedTextProps & { children: ReactElement<any>; ignoreStyle?: boolean }) {
  const color = useThemeColor("text", { light: lightColor, dark: darkColor });
  const variantKey = type as keyof typeof styles;

  const combinedStyle = [
    { color, fontFamily: "InterMedium" },
    !ignoreStyle && styles[variantKey],
    style,
  ];

  return cloneElement(children, {
    style: [(children.props as any).style ?? {}, ...combinedStyle],
    ...rest,
  });
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  defaultSemiBold: {
    fontSize: 17,
    fontFamily: "InterSemiBold",
  },
  title: {
    fontFamily: "InterSemiBold",
    fontSize: 20,
  },
  subtitle: {
    fontSize: 15,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
  bold: {
    fontSize: 16,
    fontFamily: "InterBold",
  },
});
