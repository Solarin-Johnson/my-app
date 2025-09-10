import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScreenAnimation } from "react-native-screen-transitions";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { ThemedTextWrapper } from "../ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";

const SPACING = 14;
const GAP = 10;
const HEIGHT = 58;

export interface UntitledBottomBarProps {
  type?: "fill" | "collapse";
}

export default function UntitledBottomBar({
  type = "collapse",
}: UntitledBottomBarProps) {
  const { bottom } = useSafeAreaInsets();
  const props = useScreenAnimation();
  const bg = useThemeColor("untitledBarBg");

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const {
      progress,
      layouts: {
        screen: { width },
      },
    } = props.value;

    return {
      transform: [
        {
          translateX: interpolate(progress, [0, 1, 2], [-width, 0, width]),
        },
      ],
    };
  });

  const controlAnimatedStyle = useAnimatedStyle(() => {
    const {
      progress,
      layouts: {
        screen: { width },
      },
    } = props.value;
    const FULL_WIDTH = width - SPACING * 2;
    const COLLAPSED_WIDTH = FULL_WIDTH - HEIGHT - SPACING;

    return {
      width: interpolate(
        progress,
        [0, 1, 2],
        type === "fill"
          ? [COLLAPSED_WIDTH, FULL_WIDTH, FULL_WIDTH]
          : [FULL_WIDTH, COLLAPSED_WIDTH, FULL_WIDTH]
      ),
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const {
      progress,
      layouts: {
        screen: { width },
      },
    } = props.value;
    const FULL_WIDTH = width - SPACING * 2;
    const COLLAPSED_WIDTH = FULL_WIDTH - HEIGHT - SPACING;

    return {
      transform: [
        {
          translateX:
            type === "collapse"
              ? interpolate(progress, [0, 1, 2], [0, 0, GAP])
              : 0,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom,
        },
        headerAnimatedStyle,
      ]}
    >
      <Animated.View
        style={[
          styles.controlBar,
          { backgroundColor: bg },
          styles.shadow,
          controlAnimatedStyle,
        ]}
      ></Animated.View>
      {type === "collapse" && (
        <Animated.View style={buttonAnimatedStyle}>
          <ThemedView
            style={[styles.addButton, styles.shadow]}
            colorName="untitledBarBg"
          >
            <Feather name="plus" size={22} color="white" />
          </ThemedView>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    left: 0,
    right: 0,
    position: "absolute",
    gap: GAP,
    flexDirection: "row",
    margin: SPACING,
    zIndex: 100,
    // backgroundColor: "red",
  },
  controlBar: {
    height: "100%",
    borderRadius: 50,
    borderCurve: "continuous",
  },
  addButton: {
    height: HEIGHT,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  shadow: {
    boxShadow: "0px 0 24px rgba(0,0,0,0.1)",
  },
});
