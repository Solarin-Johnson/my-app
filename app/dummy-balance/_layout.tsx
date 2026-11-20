import React from "react";
import { Slot } from "expo-router";
import { PortalHost, PortalProvider } from "react-native-teleport";
import { StyleSheet } from "react-native";

export default function Layout() {
  return (
    <PortalProvider>
      <Slot screenOptions={{ headerShown: false }} />
      <PortalHost
        style={StyleSheet.absoluteFill}
        name="dummy-balance-overlay"
      />
    </PortalProvider>
  );
}
