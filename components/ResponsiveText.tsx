import { useState, useEffect, useRef } from "react";
import { Text, View, TextProps, Platform } from "react-native";
import { ThemedText, ThemedTextProps } from "./ThemedText";

type ResponsiveTextProps = {
  text: string;
  baseSize?: number;
} & TextProps &
  ThemedTextProps;

const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  text,
  baseSize = 16,
  style,
  ...props
}) => {
  const [width, setWidth] = useState(0);
  const fontSize = Math.max(
    12,
    Math.min(32, baseSize * (width / 300) - text.length * 0.1)
  );

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ width: "100%" }}
    >
      <ThemedText
        style={[{ fontSize, lineHeight: fontSize * 1.3 }, style]}
        {...props}
      >
        {text}
      </ThemedText>
    </View>
  );
};

export default ResponsiveText;
