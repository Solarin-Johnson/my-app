import { View } from "react-native";
import StatusBarUI from "@/components/status-bar-ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getCalendars } from "expo-localization";

const is24Hour = getCalendars()[0].uses24hourClock;

export default function StatusBarPage() {
  const textColor = useThemeColor("text");
  return (
    <>
      <StatusBarUI
        timeFormat={is24Hour ? "24" : "12"}
        itemStyle={{ color: textColor, fontSize: 20 }}
        batterySize={38}
      />
      <View>{/* <Text>StatusBarPage</Text> */}</View>
    </>
  );
}
