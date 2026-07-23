import { View, Text, ScrollView, RefreshControl } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import MailThumb from "@/components/mail-app/item";
import { Host, List } from "@expo/ui";
import { Section, VStack } from "@expo/ui/swift-ui";
import { ThemedViewWrapper } from "@/components/ThemedView";
import {
  background,
  containerBackground,
  foregroundStyle,
  listRowBackground,
  overlay,
  tint,
} from "@expo/ui/swift-ui/modifiers";

export default function MailApp() {
  const [refreshing, setRefreshing] = React.useState(false);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="chevron.left">
          <Stack.Toolbar.Label>Back</Stack.Toolbar.Label>
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button>
          <Stack.Toolbar.Label>Select</Stack.Toolbar.Label>
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Stack.SearchBar onChangeText={() => {}} />
      <Stack.Screen.Title
        style={{ fontSize: 20, textAlign: "left" }}
        large
        largeStyle={{ fontSize: 32 }}
      >
        All Mail
      </Stack.Screen.Title>
      <Stack.Toolbar placement="bottom">
        <Stack.Toolbar.Button icon={"line.3.horizontal.decrease"} />
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.SearchBarSlot />
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button icon={"square.and.pencil"} />
      </Stack.Toolbar>

      <Host style={{ flex: 1, backgroundColor: "red" }}>
        <VStack>
          <List>
            <Section modifiers={[background("transparent")]}>
              <MailThumb />
              <MailThumb />
            </Section>
          </List>
        </VStack>
      </Host>
    </ScrollView>
  );
}
