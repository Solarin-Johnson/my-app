import { View, Text } from "react-native";
import React from "react";
import GestureSpeed from "@/components/gesture-speed";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureSpeed />
    </SafeAreaView>
  );
}
