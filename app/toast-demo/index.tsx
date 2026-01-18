import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DynamicToast from "@/components/dynamic-toast/toast";
import { ThemedText } from "@/components/ThemedText";
import { Toast } from "@/components/dynamic-toast";

export default function ToastDemo() {
  return (
    <Toast.Provider>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText type="italic" style={{ fontSize: 24 }}>
          Toast
        </ThemedText>
      </SafeAreaView>
      <DynamicToast />
    </Toast.Provider>
  );
}
