import { View, Text, Pressable } from "react-native";
import React from "react";
import WheelNumberInput from "@/components/WheelNumberInput";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";

export default function WheelInput() {
  const value = useSharedValue(45.89);
  const editing = useSharedValue(false);

  useDerivedValue(() => {
    console.log(value.value);
  });
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
      }}
    >
      <WheelNumberInput
        value={value}
        editing={editing}
        digitHeight={32}
        size={72}
        maxIntegerDigits={4}
        reverse={true}
      />
      <Pressable onPress={() => (editing.value = !editing.value)}>
        <ThemedText>EDIT</ThemedText>
      </Pressable>
    </SafeAreaView>
  );
}
