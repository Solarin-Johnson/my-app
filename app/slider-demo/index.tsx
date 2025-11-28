import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, StyleSheet } from "react-native";
import PlaybackControl from "@/components/PlaybackControl";

const isWeb = Platform.OS === "web";

export default function SliderDemo() {
  return (
    <SafeAreaView style={styles.container}>
      <PlaybackControl />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: isWeb ? "center" : "flex-end",
    alignItems: "center",
    paddingBottom: isWeb ? 0 : 72,
  },
});
