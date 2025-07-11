import { Text, type TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

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

  return (
    <Text
      style={[
        { color, fontFamily: "InterMedium" },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "bold" ? styles.bold : undefined,
        style,
      ]}
      {...rest}
    />
  );
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
