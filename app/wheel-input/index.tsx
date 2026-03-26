import { View, Text, Pressable } from "react-native";
import React from "react";
import WheelNumberInput from "@/components/WheelNumberInput";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";

export default function WheelInput() {
  const value = useSharedValue(45.89);
  const editing = useSharedValue(false);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <WheelNumberInput
        value={value}
        editing={editing}
        digitHeight={60}
        size={54}
        maxIntegerDigits={4}
      />
      <Pressable onPress={() => (editing.value = !editing.value)}>
        <ThemedText>EDIT</ThemedText>
      </Pressable>
    </SafeAreaView>
  );
}
