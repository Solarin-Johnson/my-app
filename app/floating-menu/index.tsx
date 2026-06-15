import { View, Text, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingMenu from "@/components/floating-gesture-menu";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { Feedback } from "@/functions";
import MenuButton from "@/components/slack-floating-menu/menu-button";
import MenuItem from "@/components/slack-floating-menu/menu-item";

export default function FloatingMenuScreen() {
  return (
    <FloatingMenu onOpen={Feedback.medium} onItemHover={Feedback.light}>
      <SafeAreaView style={{ flex: 1 }}></SafeAreaView>
      <FloatingMenu.Overlay />
      <FloatingMenu.Container inset={36}>
        <FloatingMenu.Item
          onPress={() => {
            Alert.alert("Heyy");
          }}
        >
          <MenuItem
            text="Hello World"
            image={require("@/assets/images/dp.png")}
          />
        </FloatingMenu.Item>
        <FloatingMenu.Item
          onPress={() => {
            Alert.alert("Heyy");
          }}
        >
          <MenuItem
            text="Another One"
            image={require("@/assets/images/dp.png")}
          />
        </FloatingMenu.Item>
      </FloatingMenu.Container>
      <FloatingMenu.Trigger>
        <MenuButton />
      </FloatingMenu.Trigger>
    </FloatingMenu>
  );
}
