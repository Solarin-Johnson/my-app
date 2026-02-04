import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={
          {
            //   title: "Freeform",
          }
        }
      />
    </Stack>
  );
}
