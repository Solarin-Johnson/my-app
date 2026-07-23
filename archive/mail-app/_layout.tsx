import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="index"
        // options={{
        //   title: "Mail App",
        //   headerTitleStyle: { fontWeight: "200" },
        //   headerLargeTitleStyle: { fontWeight: "100" },
        //   headerLargeTitle: true,
        // }}
      />
    </Stack>
  );
}
