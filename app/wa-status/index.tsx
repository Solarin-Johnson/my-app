import { View, Text, ScrollView } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";

export default function Index() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <ThemedText>index</ThemedText>
    </ScrollView>
  );
}
