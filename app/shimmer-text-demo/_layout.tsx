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
  text: string;
  setText: Dispatch<SetStateAction<string>>;
} | null>(null);

const isIos = Platform.OS === "ios";

export function ShimmerTextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const textColor = useThemeColor("shimmerText");

  const progress = useSharedValue(0.35);
  const pressed = useSharedValue(false);
  const playing = useDerivedValue(() => !pressed.value);
  const [rtl, setRtl] = useState(false);
  const [text, setText] = useState("Cooking...");

  const [color, setColor] = useState(textColor);
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
        text,
        setText,
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
    </ShimmerTextProvider>
  );
}
