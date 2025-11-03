import { View, Text, StyleSheet } from "react-native";
import React from "react";
import CaptchaCard from "@/components/re-captcha/card";
import { ThemedView } from "@/components/ThemedView";
import { useSharedValue } from "react-native-reanimated";
import Tray from "@/components/re-captcha/tray";

export default function ReCaptcha() {
  const shrinkProgress = useSharedValue(0);
  const isVerified = useSharedValue<boolean>(false);

  return (
    <ThemedView style={styles.container} colorName="captchaBg">
      <CaptchaCard shrinkProgress={shrinkProgress} isVerified={isVerified} />
      <Tray shrinkProgress={shrinkProgress} isVerified={isVerified} />
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
