import { View, Text } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";

export default function Status() {
  return (
    <ThemedView colorName="text" style={{ flex: 1 }}>
      <Text>Status</Text>
    </ThemedView>
  );
}
