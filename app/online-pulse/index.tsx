import { Pressable, StyleSheet, useColorScheme } from "react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import OnlinePulse from "@/components/OnlinePulse";
import { ThemedViewWrapper } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import PressableBounce from "@/components/PresableBounce";
import { GlassView } from "expo-glass-effect";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { PowerIcon, Settings, X } from "lucide-react-native";
import IconButton from "@/components/ui/icon-button";
import { Feedback } from "@/functions";

const SIZE = 120;

export default function OnlinePulseScreen() {
  const isDark = useColorScheme() === "dark";
  const [status, setStatus] = useState("online");
  const isOnline = status === "online";
  const appleRed = useThemeColor("appleRed");

  const onToggleStatus = () => {
    Feedback.medium();

    setStatus(isOnline ? "offline" : "online");
  };

  const pulseChild = (
    <ThemedTextWrapper colorName={isOnline ? "black" : "white"}>
      <PowerIcon size={42} strokeWidth={2.2} />
    </ThemedTextWrapper>
  );
  return (
    <ThemedViewWrapper colorName={isDark ? "background" : "theme"}>
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={[styles.float, styles.topItem]} edges={["top"]}>
          <ThemedText style={styles.status}>{status.toUpperCase()}</ThemedText>
          <ThemedText style={styles.title}>Device Status</ThemedText>
        </SafeAreaView>
        <PressableBounce
          onPress={onToggleStatus}
          style={styles.screen}
          hitSlop={10}
        >
          {status === "online" ? (
            <OnlinePulse size={SIZE} key={status}>
              {pulseChild}
            </OnlinePulse>
          ) : (
            <OnlinePulse
              key={status}
              size={SIZE}
              levels={1}
              color={appleRed}
              stepTime={3000}
              scale={2}
              easing="easeInOut"
            >
              {pulseChild}
            </OnlinePulse>
          )}
        </PressableBounce>
        <SafeAreaView
          style={[styles.float, styles.bottomItem]}
          edges={["bottom"]}
        >
          <IconButton
            themedViewProps={{ colorName: "text", alphaHex: "16" }}
            size={68}
          >
            <X size={30} opacity={0.9} />
          </IconButton>
          <IconButton
            themedViewProps={{ colorName: "text", alphaHex: "16" }}
            size={72}
          >
            <Settings size={30} opacity={0.9} />
          </IconButton>
        </SafeAreaView>
      </SafeAreaView>
    </ThemedViewWrapper>
  );
}

const Button = ({
  onPress,
  title,
}: {
  onPress?: () => void;
  title: string;
}) => {
  return (
    <GlassView isInteractive style={styles.buttonWrapper}>
      <Pressable
        onPress={onPress}
        style={[styles.button, styles.buttonWrapper]}
      >
        <ThemedText type="semiBold">{title}</ThemedText>
      </Pressable>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  float: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  bottomItem: {
    bottom: 8,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 32,
  },
  buttonWrapper: {
    borderRadius: 28,
    borderCurve: "continuous",
    width: "100%",
    maxWidth: 280,
  },
  button: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  screen: {},
  topItem: {
    top: 16,
    paddingHorizontal: 22,
  },
  status: {
    fontSize: 13,
    fontFamily: "regular",
    fontWeight: "600",
    lineHeight: 18,
    opacity: 0.6,
  },
  title: {
    fontSize: 36,
    fontFamily: "system",
    fontWeight: "700",
    lineHeight: 42,
  },
});
