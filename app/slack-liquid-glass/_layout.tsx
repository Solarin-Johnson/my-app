import React from "react";
import { Stack } from "expo-router";
import HeaderTitle, { HeaderRight } from "@/components/slack/header";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Slack",
          // headerShown: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          headerTitle: (props) => <HeaderTitle {...props} />,
          headerRight: () => <HeaderRight />,
          headerBackTitle: "Go Back",
          headerTransparent: true,
        }}
      />
    </Stack>
  );
}
