import { View, StyleSheet } from "react-native";
import React from "react";
import { GlassView } from "expo-glass-effect";
import { ThemedTextWrapper } from "../ThemedText";
import { Plus } from "lucide-react-native";
import { useFloatingMenu } from "../floating-gesture-menu/provider";
import { EaseView } from "react-native-ease";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

const applyTimingConfig = (value: number, duration = 200) => {
  "worklet";
  return withTiming(value, { duration, easing: Easing.in(Easing.ease) });
};

export default function MenuButton() {
  const { isOpened } = useFloatingMenu();
  const tint = "grey";
  const bg = useThemeColor("untitledBg");

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: applyTimingConfig(isOpened ? 0.5 : 1, isOpened ? 200 : 0),
      },
    ],
    opacity: applyTimingConfig(isOpened ? 0 : 1),
  }));

  return (
    <View style={styles.buttonWraper}>
      <AnimatedGlassView
        style={[styles.glass, styles.button, scaleStyle]}
        isInteractive={true}
        glassEffectStyle={"clear"}
      >
        <EaseView
          animate={{ rotate: isOpened ? -135 : 0 }}
          pointerEvents="none"
        >
          <ThemedTextWrapper>
            <Plus size={25} />
          </ThemedTextWrapper>
        </EaseView>
      </AnimatedGlassView>
      <EaseView
        animate={{ opacity: isOpened ? 1 : 0 }}
        transition={{ type: "timing", duration: 200, easing: "easeIn" }}
        style={{ flex: 1 }}
      >
        <ThemedView
          colorName="untitledBg"
          style={[styles.button]}
          pointerEvents="none"
        >
          <EaseView
            animate={{ rotate: isOpened ? -135 : 0 }}
            pointerEvents="none"
          >
            <ThemedTextWrapper>
              <Plus size={25} />
            </ThemedTextWrapper>
          </EaseView>
        </ThemedView>
      </EaseView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWraper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 100,
  },
  button: {
    flex: 1,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  glass: {
    ...StyleSheet.absoluteFill,
    borderRadius: 100,
    zIndex: -1,
  },
});
