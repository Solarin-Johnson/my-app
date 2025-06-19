import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  invert?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  invert,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    invert ? "text" : "background"
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
