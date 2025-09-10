import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScreenAnimation } from "react-native-screen-transitions";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import Feather from "@expo/vector-icons/Feather";
import { ThemedView, ThemedViewWrapper } from "../ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";
import PressableBounce from "../PresableBounce";

const SPACING = 14;
const GAP = 10;
const HEIGHT = 58;

const DATA = {
  title: "Vikings - 2013",
  name: "untitled project",
};

export interface UntitledBottomBarProps {
  type?: "fill" | "collapse";
}

export default function UntitledBottomBar({
  type = "collapse",
}: UntitledBottomBarProps) {
  const { bottom } = useSafeAreaInsets();
  const props = useScreenAnimation();
  const bg = useThemeColor("background");

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
    const { progress } = props.value;

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
      <Animated.View style={[controlAnimatedStyle]}>
        <ThemedView
          colorName="untitledBarBg"
          style={[styles.controlBar, styles.shadow]}
        >
          <PressableBounce style={[styles.disk, { borderColor: bg + "AA" }]}>
            <Ionicons name="play" size={20} color="white" />
          </PressableBounce>
          <View style={styles.content}>
            <ThemedText type="regular" style={styles.title}>
              {DATA.title}
            </ThemedText>
            <ThemedText type="regular" style={styles.subtitle}>
              {DATA.name}
            </ThemedText>
          </View>
          <Pressable style={styles.share}>
            <Ionicons name="share-outline" size={20} color="white" />
          </Pressable>
        </ThemedView>
      </Animated.View>
      {type === "collapse" && (
        <Animated.View style={buttonAnimatedStyle}>
          <ThemedViewWrapper
            style={[styles.addButton, styles.shadow]}
            colorName="untitledBarBg"
          >
            <Pressable>
              <Feather name="plus" size={22} color="white" />
            </Pressable>
          </ThemedViewWrapper>
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
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButton: {
    height: HEIGHT,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  shadow: {
    boxShadow: "0px 0px 32px rgba(0,0,0,0.1)",
  },
  disk: {
    experimental_backgroundImage: `linear-gradient(135deg, ${Colors.dark.untitledGradient2} 0%, ${Colors.dark.untitledGradient1} 80%)`,
    height: "100%",
    aspectRatio: 1,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 1,
  },
  title: {
    fontSize: 15,
    color: "white",
    opacity: 0.8,
    letterSpacing: -0.25,
  },
  subtitle: {
    fontSize: 12.2,
    opacity: 0.4,
    color: "white",
  },
  share: {
    height: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
});
