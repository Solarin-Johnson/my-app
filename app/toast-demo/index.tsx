import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import DynamicToastWrapper from "@/components/DynamicToast";
import { DynamicToast } from "@/components/dynamic-toast";

export default function ToastDemo() {
  return (
    <DynamicToast.Provider>
      <DynamicToastWrapper />
    </DynamicToast.Provider>
  );
}
