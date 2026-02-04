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
        options={
          {
            //   headerShown: false,
            //   title: "Freeform",
          }
        }
      />
    </Stack>
  );
}
