import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonKeyboard from "@/components/button-keyboard";
import { ThemedTextWrapper } from "@/components/ThemedText";

export default function ButtonKeyboardPage() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedTextWrapper>
        <ButtonKeyboard.Input style={{ fontSize: 24, textAlign: "center" }} />
      </ThemedTextWrapper>
    </SafeAreaView>
  );
}
