import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Share } from "lucide-react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";

const BAR_HEIGHT = 40;
export const DRAG_THRESHOLD = 50;

const address = "expo.dev";

interface TopBarProps {
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
}

export default function TopBar({ translateX, translateY }: TopBarProps) {
  const text = useThemeColor("text");

  const barAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: interpolate(
      translateY.value,
      [0, DRAG_THRESHOLD],
      [1, 0],
      "clamp"
    ),
  }));

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Animated.View
        style={[styles.bar, { backgroundColor: text + "36" }, barAnimatedStyle]}
      >
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: 16,
          }}
        >
          {address}
        </ThemedText>
        <Share
          color={text}
          style={styles.floatIcon}
          size={20}
          strokeWidth={2.2}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  bar: {
    height: BAR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BAR_HEIGHT / 2,
    borderCurve: "continuous",
  },
  floatIcon: {
    position: "absolute",
    right: 12,
  },
});
