import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonKeyboard from "@/components/button-keyboard";
import { ThemedTextWrapper } from "@/components/ThemedText";
import { useButtonKeyboard } from "@/components/button-keyboard/provider";

export default function ButtonKeyboardPage() {
  const { openKeyboard } = useButtonKeyboard();
  useEffect(() => {
    openKeyboard();
  }, []);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedTextWrapper
        type="italic"
        ignoreStyle={false}
        style={{
          fontSize: 36,
          textAlign: "center",
        }}
      >
        <ButtonKeyboard.Input />
      </ThemedTextWrapper>
    </SafeAreaView>
  );
}
