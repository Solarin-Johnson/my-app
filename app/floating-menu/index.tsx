import { View, Text, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingMenu from "@/components/floating-gesture-menu";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { Feedback } from "@/functions";
import MenuButton from "@/components/slack-floating-menu/menu-button";

export default function FloatingMenuScreen() {
  return (
    <FloatingMenu onOpen={Feedback.medium} onItemHover={Feedback.light}>
      <SafeAreaView style={{ flex: 1 }}></SafeAreaView>
      <FloatingMenu.Overlay />
      <FloatingMenu.Container>
        <FloatingMenu.Item
          onPress={() => {
            Alert.alert("Heyy");
          }}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <ThemedText>Heyy</ThemedText>
        </FloatingMenu.Item>
        <FloatingMenu.Item
          onPress={() => {
            Alert.alert("Another");
          }}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <ThemedText>Another</ThemedText>
        </FloatingMenu.Item>
      </FloatingMenu.Container>
      <FloatingMenu.Trigger>
        <MenuButton />
      </FloatingMenu.Trigger>
    </FloatingMenu>
  );
}
