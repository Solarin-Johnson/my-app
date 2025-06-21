import React from "react";
import { Slot } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function Layout() {
  return (
    <KeyboardProvider>
      <Slot screenOptions={{ headerShown: false }} />
    </KeyboardProvider>
  );
}
