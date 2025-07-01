import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Plus, RotateCw, Share, X } from "lucide-react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { act, ReactNode } from "react";
import { ThemedView } from "./ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ReloadIcon } from "./icons";

const BAR_HEIGHT = 40;
const ICON_SIZE = 80;
export const DRAG_THRESHOLD = 50;

const address = "expo.dev";

interface TopBarProps {
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
}

export default function TopBar({ translateX, translateY }: TopBarProps) {
  const text = useThemeColor("text");
  const bg = useThemeColor("background");

  const iconProps = {
    color: text,
    size: 31,
    strokeWidth: 2.3,
    weight: 2.3,
  };

  const barAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, DRAG_THRESHOLD],
      [1, 0],
      "clamp"
    ),
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    height: BAR_HEIGHT + translateY.value,
  }));

  const actionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [DRAG_THRESHOLD / 1.5, DRAG_THRESHOLD + BAR_HEIGHT],
      [0, 1],
      "clamp"
    ),
  }));

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={{ height: BAR_HEIGHT }}>
        <Animated.View style={[styles.wrapper, animatedStyle]}>
          <Animated.View style={[styles.actionWrapper, actionAnimatedStyle]}>
            <ActionItem
              icon={
                <View style={styles.iconStyle}>
                  <Plus {...iconProps} />
                </View>
              }
              label="Share"
            />
            <ActionItem
              icon={
                <View style={styles.iconStyle}>
                  <ReloadIcon {...iconProps} />
                </View>
              }
              label="Refresh"
            />
            <ActionItem
              icon={
                <View style={styles.iconStyle}>
                  <X {...iconProps} />
                </View>
              }
              label="Share"
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.barWrapper,
              { backgroundColor: bg },
              barAnimatedStyle,
            ]}
          >
            <Animated.View
              style={[styles.bar, { backgroundColor: "#ffffff40" }]}
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
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const ActionItem = ({
  icon,
  label,
  active,
}: {
  icon: ReactNode;
  label: string;
  active?: SharedValue<boolean>;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: active?.value ? 1 : 0,
  }));

  return (
    <View style={styles.actionItem}>
      {icon}
      <Animated.View style={animatedStyle}>
        <ThemedText type="defaultSemiBold" style={styles.actionLabel}>
          {label}
        </ThemedText>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  wrapper: {
    position: "absolute",
    top: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  bar: {
    height: BAR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  barWrapper: {
    borderRadius: BAR_HEIGHT / 2,
    borderCurve: "continuous",
    overflow: "hidden",
    width: "100%",
    alignSelf: "flex-end",
  },
  floatIcon: {
    position: "absolute",
    right: 12,
  },
  actionLabel: {
    fontSize: 12,
  },
  actionItem: {
    width: ICON_SIZE,
    alignItems: "center",
  },
  actionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    alignSelf: "center",
    gap: BAR_HEIGHT,
  },
  iconStyle: {
    width: ICON_SIZE,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
