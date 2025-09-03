import { View, Text } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import Transition from "react-native-screen-transitions";
import { router } from "expo-router";

export default function Status() {
  return (
    <ThemedView colorName="text" style={{ flex: 1 }}>
      <Transition.View
        sharedBoundTag="status"
        style={{ width: 200, height: 400, backgroundColor: "red" }}
        onTouchEnd={router.back}
      >
        <Text>Status</Text>
      </Transition.View>
    </ThemedView>
  );
}
