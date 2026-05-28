import { StyleSheet, useColorScheme } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import OnlinePulse from "@/components/OnlinePulse";
import { ThemedViewWrapper } from "@/components/ThemedView";

export default function OnlinePulseScreen() {
  const isDark = useColorScheme() === "dark";
  return (
    <ThemedViewWrapper colorName={isDark ? "background" : "theme"}>
      <SafeAreaView style={styles.container}>
        <OnlinePulse disableAnimation={!false} />
      </SafeAreaView>
    </ThemedViewWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
