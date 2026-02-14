import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <ThemedTextWrapper>
        <Link href="/custom-back/123">Go to [id]</Link>
      </ThemedTextWrapper>
    </SafeAreaView>
  );
}
