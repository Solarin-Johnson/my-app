import { View } from "react-native";
import StatusBarUI from "@/components/status-bar-ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/ThemedView";
import DrawPad from "expo-drawpad";

export default function StatusBarPage() {
  const textColor = useThemeColor("text");

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
        <DrawPad />
      </ThemedView>
    </>
  );
}
