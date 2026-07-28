import { View } from "react-native";
import StatusBarUI from "@/components/status-bar-ui";
import { useThemeColor } from "@/hooks/useThemeColor";

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
      <View>{/* <Text>StatusBarPage</Text> */}</View>
    </>
  );
}
