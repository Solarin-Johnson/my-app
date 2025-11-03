import { View, Text, StyleSheet } from "react-native";
import React from "react";
import CaptchaCard from "@/components/re-captcha/card";
import { ThemedView } from "@/components/ThemedView";

export default function ReCaptcha() {
  return (
    <ThemedView style={styles.container} colorName="barColor">
      <CaptchaCard />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
