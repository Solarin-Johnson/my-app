import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@/components/Slider";
import { View } from "react-native";

export default function SliderDemo() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Slider />
    </SafeAreaView>
  );
}
