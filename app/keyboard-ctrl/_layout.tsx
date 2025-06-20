import React from "react";
import { Slot } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function Layout() {
  return <Slot screenOptions={{ headerShown: false }} />;
}
