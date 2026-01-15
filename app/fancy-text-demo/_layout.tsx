import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { Stack } from "expo-router";
import {
  DerivedValue,
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Platform } from "react-native";

export const FancyTextContext = createContext<{} | null>(null);

const isIos = Platform.OS === "ios";

export function FancyTextProvider({ children }: { children: React.ReactNode }) {
  return (
    <FancyTextContext.Provider value={{}}>{children}</FancyTextContext.Provider>
  );
}

export function useFancyText() {
  const context = React.useContext(FancyTextContext);
  if (!context) {
    throw new Error("useFancyText must be used within FancyTextProvider");
  }
  return context;
}

export default function Layout() {
  return (
    <FancyTextProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{}} />
        <Stack.Screen
          name="customize"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: [0.2, 0.37],
            sheetLargestUndimmedDetentIndex: 1,
            sheetInitialDetentIndex: 1,
            contentStyle: {
              ...(isIos && {
                backgroundColor: "transparent",
              }),
            },
          }}
        />
      </Stack>
    </FancyTextProvider>
  );
}
