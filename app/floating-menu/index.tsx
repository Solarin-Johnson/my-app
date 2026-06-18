import { View, Text, Alert, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingMenu from "@/components/floating-gesture-menu";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { Feedback } from "@/functions";
import MenuButton from "@/components/slack-floating-menu/menu-button";
import MenuItem from "@/components/slack-floating-menu/menu-item";
import { ThemedViewWrapper } from "@/components/ThemedView";
const MENU = [
  {
    id: "1",
    text: "Alice",
    image: { uri: "https://api.dicebear.com/10.x/thumbs/jpg?seed=1" },
  },
  {
    id: "2",
    text: "Bob Smith",
    image: { uri: "https://api.dicebear.com/10.x/thumbs/jpg?seed=2" },
  },
  {
    id: "3",
    text: "Taylor",
    image: { uri: "https://api.dicebear.com/10.x/thumbs/jpg?seed=3" },
  },
  {
    id: "4",
    text: "Dana Lee",
    image: { uri: "https://api.dicebear.com/10.x/thumbs/jpg?seed=4" },
  },
  {
    id: "5",
    text: "Evan",
    image: { uri: "https://api.dicebear.com/10.x/thumbs/jpg?seed=5" },
  },
  {
    id: "6",
    text: "Fiona Chen",
    image: { uri: "https://api.dicebear.com/10.x/thumbs/jpg?seed=6" },
  },
  {
    id: "7",
    text: "George King",
    image: { uri: "https://api.dicebear.com/10.x/thumbs/jpg?seed=7" },
  },
];

export default function FloatingMenuScreen() {
  return (
    <FloatingMenu
      onOpen={Feedback.medium}
      onItemHover={Feedback.light}
      bottomInset={72}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText>Content</ThemedText>
      </SafeAreaView>
      <FloatingMenu.Overlay />
      <FloatingMenu.Container inset={36}>
        {MENU.map((item) => (
          <FloatingMenu.Item
            key={item.id}
            onPress={() => {
              Alert.alert(item.text);
            }}
          >
            <MenuItem text={item.text} image={item.image} />
          </FloatingMenu.Item>
        ))}
      </FloatingMenu.Container>
      <FloatingMenu.Trigger>
        <MenuButton />
      </FloatingMenu.Trigger>
      <FloatingMenu.ButtonContainer right={106} height={60}>
        <ThemedViewWrapper colorName="untitledBg">
          <FloatingMenu.Button
            style={{ height: "100%", paddingHorizontal: 28 }}
            onPress={() => {
              Alert.alert("Manage");
            }}
          >
            <ThemedText
              style={{
                letterSpacing: -0.2,
                fontFamily: "system",
                fontWeight: 600,
              }}
            >
              Manage List
            </ThemedText>
          </FloatingMenu.Button>
        </ThemedViewWrapper>
      </FloatingMenu.ButtonContainer>
    </FloatingMenu>
  );
}
