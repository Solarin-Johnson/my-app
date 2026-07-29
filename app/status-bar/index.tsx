import { View } from "react-native";
import StatusBarUI from "@/components/status-bar-ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/ThemedView";
import DrawPad from "expo-drawpad";
import { ThemedTextWrapper } from "@/components/ThemedText";

export default function StatusBarPage() {
  const textColor = useThemeColor("invertedTheme");

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
        <ThemedTextWrapper colorName="invertedTheme" attribute="stroke">
          <DrawPad />
        </ThemedTextWrapper>
      </ThemedView>
    </>
  );
}
