import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import PlaybackControl from "@/components/PlaybackControl";

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
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 72,
  },
});
