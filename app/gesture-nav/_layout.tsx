import React from "react";
import { Slot } from "expo-router";

export default function Layout() {
  return <Slot screenOptions={{ headerShown: false }} />;
}
