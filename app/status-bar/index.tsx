import { View } from "react-native";
import StatusBarUI from "@/components/status-bar-ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/ThemedView";
import DrawPad, { DrawPadHandle } from "expo-drawpad";
import { ThemedTextWrapper } from "@/components/ThemedText";
import DotPatternBackground from "@/components/DotPattern";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";

export default function StatusBarPage() {
  const textColor = useThemeColor("invertedTheme");
  const padRef = useRef<DrawPadHandle>(null);

  useEffect(() => {
    // padRef.current?.erase();
  }, []);

  return (
    <>
      <StatusBarUI
        itemStyle={{
          color: textColor,
          fontSize: 20,
        }}
        batterySize={38}
      />
      <ThemedView style={{ flex: 1 }} colorName="theme">
        <ThemedTextWrapper>
          <DotPatternBackground opacity={0.25} />
        </ThemedTextWrapper>
        <SafeAreaView style={{ flex: 1 }}>
          <ThemedTextWrapper colorName="invertedTheme" attribute="stroke">
            <DrawPad ref={padRef} />
          </ThemedTextWrapper>
        </SafeAreaView>
      </ThemedView>
    </>
  );
}
