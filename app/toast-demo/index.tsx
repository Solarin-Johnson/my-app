import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DynamicToast from "@/components/dynamic-toast";
import { ThemedText } from "@/components/ThemedText";

export default function ToastDemo() {
  return (
    <>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText type="italic" style={{ fontSize: 24 }}>
          Toast
        </ThemedText>
      </SafeAreaView>
      <DynamicToast />
    </>
  );
}
