import { View, StyleSheet, ViewStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";

type ProgressiveFadeProps = {
  direction?: "top" | "bottom";
  height?: number;
  style?: ViewStyle | ViewStyle[];
};

export default function ProgressiveFade({
  direction = "top",
  height = 64,
  style: customStyle,
}: ProgressiveFadeProps) {
  const color = useThemeColor("background");
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          [direction]: 0,
          height: height + insets[direction],
        },
        customStyle,
      ]}
    >
      <View
        style={[
          {
            experimental_backgroundImage: `linear-gradient(${
              direction === "top" ? "to bottom" : "to top"
            }, ${color} 0%, ${color}00) 100%`,
          },
          StyleSheet.absoluteFill,
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    left: 0,
    right: 0,
  },
});
