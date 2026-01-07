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

export const ShimmerTextContext = createContext<{
  progress: SharedValue<number>;
  pressed: SharedValue<boolean>;
  playing: DerivedValue<boolean>;
  duration: SharedValue<number>;
  size: SharedValue<number>;
  rtl: boolean;
  setRtl: Dispatch<SetStateAction<boolean>>;
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  tintColor: string;
  setTintColor: Dispatch<SetStateAction<string>>;
} | null>(null);

export function ShimmerTextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const text = useThemeColor("shimmerText");

  const progress = useSharedValue(0.35);
  const pressed = useSharedValue(false);
  const playing = useDerivedValue(() => !pressed.value);
  const [rtl, setRtl] = useState(false);

  const [color, setColor] = useState(text);
  const [tintColor, setTintColor] = useState("#FFFFFF");
  const duration = useSharedValue(3000);
  const size = useSharedValue(60);

  return (
    <ShimmerTextContext.Provider
      value={{
        progress,
        pressed,
        playing,
        rtl,
        color,
        duration,
        size,
        setRtl,
        setColor,
        tintColor,
        setTintColor,
      }}
    >
      {children}
    </ShimmerTextContext.Provider>
  );
}

export function useShimmerText() {
  const context = React.useContext(ShimmerTextContext);
  if (!context) {
    throw new Error("useShimmerText must be used within ShimmerTextProvider");
  }
  return context;
}

export default function Layout() {
  return (
    <ShimmerTextProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="customize"
      >
        <Stack.Screen name="index" options={{}} />
        <Stack.Screen
          name="customize"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: [0.2, 0.4],
            // gestureEnabled: false,
            sheetLargestUndimmedDetentIndex: 1,
            contentStyle: {
              backgroundColor: "transparent",
            },
          }}
        />
      </Stack>
    </ShimmerTextProvider>
  );
}
