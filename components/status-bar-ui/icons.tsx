import { SPRING_CONFIG } from "@/constants";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Defs, Mask, Path, Rect, Svg } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
  weight?: number;
  style?: StyleProp<ViewStyle>;
  percent?: number;
  textStyle?: StyleProp<TextStyle>;
  isCharging?: boolean;
  variant?: "percentage" | "fill";
}

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const applySpring = (value: number) => {
  "worklet";
  return withSpring(value, SPRING_CONFIG);
};

export const BatteryIcon = ({
  percent = 0.25,
  style,
  textStyle,
  isCharging,
  variant = "fill",
  ...props
}: IconProps) => {
  const { size = 34, color = "black", weight = 2 } = props;
  const width = size;
  const height = (size / 43) * 25;

  const battery = Math.min(1, percent) ?? 0;
  const batteryLevel = Math.floor(battery * 100);

  const rectAnimatedProps = useAnimatedProps(() => ({
    width: applySpring(variant === "fill" && !isCharging ? 43 * battery : 0),
  }));

  const percentAnimatedStyle = useAnimatedStyle(() => {
    const active = variant === "percentage" || battery <= 0 || isCharging;
    return {
      opacity: applySpring(active ? 1 : 0),
      transform: [
        {
          scale: applySpring(active ? 1 : 0.8),
        },
      ],
    };
  });

  return (
    <View style={style}>
      <Svg width={width} height={height} viewBox="0 0 43 25" fill="none">
        <Defs>
          <Mask id="battery-mask" x="0" y="0" width="43" height="25">
            <Path
              d="M16.6737 1.25381C10.2989 2.15545 3.32609 2.13237 2.59792 2.5163C2.36068 2.68548 1.72058 4.67574 1.62717 5.08723C1.29195 6.56398 0.925288 5.63579 1.03557 14.6477C1.08065 18.3312 0.668286 19.9904 1.8288 21.2203C2.99269 22.4539 4.74154 22.4711 6.55318 22.7568C8.5611 23.0734 11.8028 23.4449 18.7588 23.9771C20.5176 24.1117 23.7419 23.6449 29.0284 22.7708C32.1614 22.2527 35.5642 24.6974 37.0904 20.9411C37.8337 19.1117 38.0001 19.4726 38 9.81383C38 2.86915 37.4849 3.51986 36.0887 2.5163C35.4868 2.08364 32.6362 1.59932 27.5707 1.24957C23.9543 0.999885 19.5917 0.841097 16.6737 1.25381Z"
              fill="white"
            />
          </Mask>
        </Defs>

        <AnimatedRect
          width={43 * battery}
          height="25"
          fill={color}
          mask="url(#battery-mask)"
          animatedProps={rectAnimatedProps}
        />
        <Path
          d="M16.6737 1.25381C10.2989 2.15545 3.32609 2.13237 2.59792 2.5163C2.36068 2.68548 1.72058 4.67574 1.62717 5.08723C1.29195 6.56398 0.925288 5.63579 1.03557 14.6477C1.08065 18.3312 0.668286 19.9904 1.8288 21.2203C2.99269 22.4539 4.74154 22.4711 6.55318 22.7568C8.5611 23.0734 11.8028 23.4449 18.7588 23.9771C20.5176 24.1117 23.7419 23.6449 29.0284 22.7708C32.1614 22.2527 35.5642 24.6974 37.0904 20.9411C37.8337 19.1117 38.0001 19.4726 38 9.81383C38 2.86915 37.4849 3.51986 36.0887 2.5163C35.4868 2.08364 32.6362 1.59932 27.5707 1.24957C23.9543 0.999885 19.5917 0.841097 16.6737 1.25381Z"
          stroke={color}
          strokeWidth={weight}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M41 5.04517C41.0018 5.04517 41.0036 5.04517 41.1692 6.52991C41.3347 8.01466 41.6639 10.9842 41.8259 12.9591C41.9878 14.934 41.9726 15.8244 41.8401 16.8105C41.7076 17.7966 41.4583 18.8514 41.1873 19.9549"
          stroke={color}
          strokeWidth={weight}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Animated.View style={[styles.percent, percentAnimatedStyle]}>
        <Text
          style={[
            styles.percentText,
            textStyle,
            {
              fontSize: size / 2.3,
              letterSpacing: battery === 1 ? -0.5 : 1.5,
            },
          ]}
        >
          {isCharging ? "ϟ" : battery >= 0 ? `${batteryLevel}` : "?"}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  percent: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  percentText: {
    fontSize: 10,
    marginLeft: "-5%",
    fontVariant: ["tabular-nums"],
    fontFamily: "ui-serif",
    fontWeight: "400",
  },
});
