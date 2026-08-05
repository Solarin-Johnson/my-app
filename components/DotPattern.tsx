import { ImageBackground, StyleSheet } from "react-native";

export default function DotPatternBackground({
  opacity = 0.5,
  color = "grey",
}: {
  opacity?: number;
  color?: string;
}) {
  return (
    <ImageBackground
      source={require("@/assets/images/dot.png")}
      resizeMode="repeat"
      tintColor={color}
      style={[
        StyleSheet.absoluteFill,
        {
          opacity,
          zIndex: 0,
          marginHorizontal: -4,
        },
      ]}
    />
  );
}
