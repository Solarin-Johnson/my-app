import { StyleSheet, View } from "react-native";
import React, { ComponentProps } from "react";
import Svg, { Path } from "react-native-svg";
import { useThemeColor } from "@/hooks/useThemeColor";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedProps,
  useDerivedValue,
} from "react-native-reanimated";
import { svgPathProperties } from "svg-path-properties";

interface RefreshLogoProps {
  scrollY: SharedValue<number>;
  maxScrollY?: number;
  svgProps?: ComponentProps<typeof Svg>;
  pathProps?: ComponentProps<typeof Path>;
  width?: number;
  height?: number;
  d?: string;
  size?: number;
  visiblePercent?: number;
  inverted?: boolean;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const PATH_LENGTH_ADJUSTMENT = 0.5; // Adjustment for path length calculation
const MAX_PROGRESS = 0.92; // Maximum progress for the animation
const defaultD =
  "M21 12C20.9999 13.9005 20.3981 15.7523 19.2809 17.2899C18.1637 18.8274 16.5885 19.9719 14.7809 20.5591C12.9733 21.1464 11.0262 21.1463 9.21864 20.559C7.41109 19.9716 5.83588 18.8271 4.71876 17.2895C3.60165 15.7518 2.99999 13.9 3 11.9994C3.00001 10.0989 3.60171 8.24706 4.71884 6.70945C5.83598 5.17184 7.4112 4.02736 9.21877 3.44003C11.0263 2.8527 12.9734 2.85267 14.781 3.43995";

export default function RefreshLogo({
  scrollY,
  maxScrollY = 100,
  svgProps,
  pathProps,
  width = 24,
  height = 24,
  size = 50,
  d = defaultD,
  visiblePercent = 12,
  inverted = false,
}: RefreshLogoProps) {
  const textColor = useThemeColor("text");
  const length =
    new svgPathProperties(d).getTotalLength() + PATH_LENGTH_ADJUSTMENT;
  const viewBox = `0 0 ${width} ${height}`;

  const combinedPathProps = {
    ...pathProps,
    d,
    stroke: pathProps?.stroke || textColor,
    strokeWidth: pathProps?.strokeWidth || 1.6,
    strokeLinecap: pathProps?.strokeLinecap || "round",
  };

  const getPortion = (percent: number) => {
    "worklet";
    return (percent / 100) * length;
  };

  const progress = useDerivedValue(() => {
    return Math.min(1, -(scrollY.value / maxScrollY));
  });

  const animatedPathProps = useAnimatedProps(() => {
    const visibleLength = getPortion(visiblePercent);
    const p = Math.max(
      -MAX_PROGRESS,
      inverted ? Math.max(0, progress.value) : Math.min(0, -progress.value)
    );
    const offset = (length + visibleLength) * p;

    return {
      strokeDashoffset: offset + visibleLength,
      strokeDasharray: `${getPortion(visiblePercent)} ${length}`,
    };
  });

  const animatedFadedPathProps = useAnimatedProps(() => {
    console.log(progress.value);
    return {
      opacity: interpolate(
        progress.value,
        [0, 0.4],
        [1, 0.25],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedSvg
        viewBox={viewBox}
        width={size || width}
        height={size || height}
        {...svgProps}
      >
        <AnimatedPath
          {...combinedPathProps}
          fill="none"
          animatedProps={animatedPathProps}
        />
        <AnimatedPath
          {...combinedPathProps}
          fill="none"
          animatedProps={animatedFadedPathProps}
        />
      </AnimatedSvg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
