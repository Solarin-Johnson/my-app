import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { Stack } from "expo-router";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { Platform } from "react-native";

export const FancyTextContext = createContext<{
  bounce: boolean;
  setBounce?: Dispatch<SetStateAction<boolean>>;
  currentIndex: SharedValue<number>;
} | null>(null);

const isIos = Platform.OS === "ios";

export function FancyTextProvider({ children }: { children: React.ReactNode }) {
  const currentIndex = useSharedValue(0);
  const [bounce, setBounce] = useState(true);

  return (
    <FancyTextContext.Provider
      value={{
        bounce,
        setBounce,
        currentIndex,
      }}
    >
      {children}
    </FancyTextContext.Provider>
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
            sheetAllowedDetents: [0.17, 0.37],
            sheetLargestUndimmedDetentIndex: 1,
            sheetInitialDetentIndex: 0,
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
