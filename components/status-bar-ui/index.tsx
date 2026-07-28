import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BatteryIcon } from "@/components/status-bar-ui/icons";
import { useBatteryLevel } from "expo-battery";

type TimeFormat = "12" | "24";

type StatusBarUIProps = {
  timeFormat?: TimeFormat;
  timeStyle?: StyleProp<TextStyle>;
  itemStyle?: StyleProp<ViewStyle | TextStyle>;
  batteryColor?: string;
  batterySize?: number;
};

function getCurrentTime(format: TimeFormat = "24") {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");

  if (Number(format) === 12) {
    hours = hours % 12 || 12;
    return `${hours}:${minutes}`;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

export default function StatusBarUI({
  timeFormat = "24",
  timeStyle,
  itemStyle,
  batteryColor,
  batterySize = 32,
}: StatusBarUIProps) {
  const currentTime = getCurrentTime(timeFormat);
  const batteryLevel = useBatteryLevel();
  const _batteryLevel = Math.round(Math.abs(batteryLevel ?? 0) * 100);
  const { top } = useSafeAreaInsets();
  const flattenedItemStyle = StyleSheet.flatten(itemStyle as TextStyle);

  return (
    <>
      <StatusBar hidden />
      <View style={[styles.bar, { height: top }]}>
        <Text style={[styles.timeText, itemStyle as TextStyle, timeStyle]}>
          {currentTime}
        </Text>
        <View>
          <BatteryIcon
            color={
              batteryColor || (flattenedItemStyle?.color as string) || "black"
            }
            size={batterySize}
          />
          <View style={styles.percent}>
            <Text
              style={[
                styles.percentText,
                itemStyle as TextStyle,
                {
                  fontSize: batterySize / 2.3,
                  letterSpacing: -batteryLevel === 1 ? 0 : 1.5,
                },
              ]}
            >
              {batteryLevel !== null ? `${_batteryLevel}` : "?"}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 48,
    paddingTop: "1.25%",
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  timeText: {
    fontSize: 16,
    fontFamily: "ui-serif",
    fontWeight: "400",
  },
  percent: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  percentText: {
    fontSize: 10,
    fontFamily: "ui-serif",
    fontWeight: "400",
    marginLeft: "-5%",
  },
});
