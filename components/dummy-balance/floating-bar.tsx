import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { ThemedView, ThemedViewWrapper } from "../ThemedView";
import { GlassView } from "expo-glass-effect";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Bell } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";

export default function FloatingBar() {
  const { bottom } = useSafeAreaInsets();
  const background = useThemeColor("background");

  return (
    <>
      <LinearGradient
        style={[
          styles.edgeFade,
          {
            height: bottom + 80,
          },
        ]}
        pointerEvents="none"
        colors={[
          background + "00",
          background + "90",
          background + "DD",
          background,
        ]}
        locations={[0, 0.3, 0.6, 1]}
      />
      <GlassView
        style={[styles.container, { bottom }]}
        //   tintColor={tint + "10"}
        isInteractive
      >
        <View style={styles.content}>
          <Image
            style={styles.avatar}
            source={require("@/assets/images/dp.png")}
          />
          <View style={styles.contentText}>
            <ThemedText style={styles.subLabel}>Welcome back</ThemedText>
            <ThemedText style={styles.label}>Solarin</ThemedText>
          </View>
        </View>
        <ThemedViewWrapper
          style={styles.notificationIcon}
          colorName="invertedTheme"
          alphaHex="16"
        >
          <Pressable>
            <ThemedTextWrapper>
              <Bell size={23} />
            </ThemedTextWrapper>
          </Pressable>
        </ThemedViewWrapper>
      </GlassView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    width: 265,
    height: 60,
    borderRadius: 24,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
    zIndex: 999,
    borderCurve: "continuous",
    backgroundImage: "linear-gradient(50deg, transparent 0%, #88888820 100%)",
  },
  avatar: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    borderCurve: "continuous",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contentText: {},
  label: {
    fontFamily: "KodeMonoSemiBold",
    fontWeight: 700,
    letterSpacing: -0.3,
    fontSize: 18,
    // lineHeight: 24,
  },
  subLabel: {
    fontSize: 13,
    fontFamily: "ui-monospace",
    letterSpacing: -0.5,
    fontWeight: 400,
    opacity: 0.5,
  },
  notificationIcon: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: 14,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
  },
  edgeFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
});
