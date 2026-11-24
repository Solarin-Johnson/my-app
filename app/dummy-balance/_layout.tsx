import React from "react";
import { Slot } from "expo-router";
import { PortalHost, PortalProvider } from "react-native-teleport";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import {
  DummyBalPortalProvider,
  useDummyBalPortalContext,
} from "@/components/dummy-balance/dummybal-portal-context";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

const AnimatedPortalHost = Animated.createAnimatedComponent(PortalHost);

export default function Layout() {
  return (
    <DummyBalPortalProvider>
      <PortalProvider>
        <Slot screenOptions={{ headerShown: false }} />
        <DummyPortalHost />
      </PortalProvider>
    </DummyBalPortalProvider>
  );
}

const DummyPortalHost = () => {
  const { cord } = useDummyBalPortalContext();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: cord.value.y,
      left: cord.value.x,
      right: cord.value.x,
    };
  });

  return (
    <AnimatedPortalHost
      style={[StyleSheet.absoluteFill, animatedStyle]}
      name="dummy-balance-overlay"
    ></AnimatedPortalHost>
  );
};
