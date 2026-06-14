import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingMenu from "@/components/floating-gesture-menu";
import { Plus } from "lucide-react-native";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { Feedback } from "@/functions";

export default function FloatingMenuScreen() {
  return (
    <FloatingMenu onOpen={Feedback.medium}>
      <SafeAreaView style={{ flex: 1 }}>
        <FloatingMenu.Container>
          <FloatingMenu.Item
            onPress={() => {
              console.log("hey");
            }}
          >
            <ThemedText>Heyy</ThemedText>
          </FloatingMenu.Item>
          <FloatingMenu.Item
            onPress={() => {
              console.log("hey");
            }}
          >
            <ThemedText>Another</ThemedText>
          </FloatingMenu.Item>
        </FloatingMenu.Container>
        <FloatingMenu.Trigger>
          <ThemedTextWrapper>
            <Plus />
          </ThemedTextWrapper>
        </FloatingMenu.Trigger>
      </SafeAreaView>
    </FloatingMenu>
  );
}
