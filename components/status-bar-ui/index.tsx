import {
  AppState,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BatteryIcon } from "./icons";
import {
  addBatteryLevelListener,
  addBatteryStateListener,
  BatteryState,
  getBatteryLevelAsync,
  getBatteryStateAsync,
} from "expo-battery";
import { useEffect, useState } from "react";
import { getCalendars } from "expo-localization";
import { useCurrentTimeShared } from "./hook";

type TimeFormat = "12" | "24";

type StatusBarUIProps = {
  timeFormat?: TimeFormat;
  timeStyle?: StyleProp<TextStyle>;
  itemStyle?: StyleProp<ViewStyle | TextStyle>;
  batteryColor?: string;
  batterySize?: number;
  batteryVariant?: "percentage" | "fill";
};

export default function StatusBarUI({
  timeFormat: _timeFormat,
  timeStyle,
  itemStyle,
  batteryColor,
  batterySize = 32,
  batteryVariant: initBatteryVariant = "percentage",
}: StatusBarUIProps) {
  const [timeFormat, setTimeFormat] = useState<TimeFormat>(_timeFormat || "24");
  const currentTime = useCurrentTimeShared(timeFormat);
  const [battery, setBattery] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const { top } = useSafeAreaInsets();
  const flattenedItemStyle = StyleSheet.flatten(itemStyle as TextStyle);

  const [batteryVariant, setBatteryVariant] = useState<"percentage" | "fill">(
    initBatteryVariant,
  );

  useEffect(() => {
    getBatteryLevelAsync().then(setBattery);

    const subscription = addBatteryLevelListener(({ batteryLevel }) => {
      setBattery(batteryLevel);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    getBatteryStateAsync().then((state) => {
      setIsCharging(state === BatteryState.CHARGING);
    });

    const subscription = addBatteryStateListener(({ batteryState }) => {
      setIsCharging(batteryState === BatteryState.CHARGING);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active" && !_timeFormat) {
        const is24Hour = getCalendars()[0].uses24hourClock;
        setTimeFormat(is24Hour ? "24" : "12");
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <StatusBar hidden />
      <View style={[styles.bar, { height: top }]}>
        <Pressable
          onPress={() => {
            setTimeFormat((prev) => (prev === "24" ? "12" : "24"));
          }}
        >
          <Text style={[styles.timeText, itemStyle as TextStyle, timeStyle]}>
            {currentTime}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setBatteryVariant((prev) =>
              prev === "percentage" ? "fill" : "percentage",
            );
          }}
        >
          <BatteryIcon
            color={
              batteryColor || (flattenedItemStyle?.color as string) || "black"
            }
            size={batterySize}
            percent={0.25}
            textStyle={[itemStyle as TextStyle]}
            //   variant="percentage"
            variant={batteryVariant}
            isCharging={isCharging ?? false}
          />
        </Pressable>
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
    fontVariant: ["tabular-nums"],
  },
});
