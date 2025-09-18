import React from "react";
import { Slot, Stack } from "expo-router";
import HeaderTitle, { HeaderRight } from "@/components/slack/header";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Slack",
          // headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerTitle: (props) => <HeaderTitle {...props} />,
          headerRight: () => <HeaderRight />,
          // headerShown: false,
        }}
      />
    </Stack>
  );
}
