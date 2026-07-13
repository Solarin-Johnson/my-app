import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        freezeOnBlur: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="expanded"
        options={{
          animation: "none",
          // presentation: "transparentModal",
        }}
      />
    </Stack>
  );
}
