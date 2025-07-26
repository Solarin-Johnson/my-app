import { StyleSheet, View } from "react-native";
import React, { ComponentProps } from "react";
import Svg, { Path } from "react-native-svg";
import { useThemeColor } from "@/hooks/useThemeColor";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useDerivedValue,
} from "react-native-reanimated";
import { svgPathProperties } from "svg-path-properties";
import * as Haptics from "expo-haptics";

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
const MAX_PROGRESS = 0.99; // Maximum progress for the animation
const FADE_THRESHOLD = 0.4; // Threshold for fading effect
const FADE_OPACITY = 0.3; // Opacity when faded
const STROKE_WIDTH = 1.6; // Default stroke width for the path
const VISIBLE_PERCENT = 12; // Default visible percent for the path
const SIZE = 50; // Default size for the logo
const STROKE_CAP = "round"; // Default stroke cap for the path
const MAX_SCROLL_Y = 100; // Default maximum scroll Y value
const WIDTH = 24; // Default width for the SVG
const HEIGHT = 24; // Default height for the SVG

const DEFAULT_D =
  "M22 4.00002C22 4.00002 21.3 6.10002 20 7.40002C21.6 17.4 10.6 24.7 2 19C4.2 19.1 6.4 18.4 8 17C3 15.5 0.5 9.60002 3 5.00002C5.2 7.60002 8.6 9.10002 12 9.00002C11.1 4.80002 16 2.40002 19 5.20002C20.1 5.20002 22 4.00002 22 4.00002Z";

const progressiveFeedback = () => {
  Haptics.selectionAsync();
};

const completeFeedback = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

export default function RefreshLogo({
  scrollY,
  maxScrollY = MAX_SCROLL_Y,
  svgProps,
  pathProps,
  width = WIDTH,
  height = HEIGHT,
  size = SIZE,
  d = DEFAULT_D,
  visiblePercent = VISIBLE_PERCENT,
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
    strokeWidth: pathProps?.strokeWidth || STROKE_WIDTH,
    strokeLinecap: pathProps?.strokeLinecap || STROKE_CAP,
  };

  const getPortion = (percent: number) => {
    "worklet";
    return (percent / 100) * length;
  };

  const progress = useDerivedValue(() => {
    return Math.min(1, -(scrollY.value / maxScrollY));
  });

  useAnimatedReaction(
    () => progress.value,
    (curr) => {
      const p = curr * 100;
      const step = 5;
      if (p >= step && p % step < 1 && p < 100) {
        // runOnJS(progressiveFeedback)(); // Uncomment to enable progressive feedback(feels a bit too much)
      } else if (p >= 100) {
        runOnJS(completeFeedback)();
      }
    }
  );

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
    return {
      opacity: interpolate(
        progress.value,
        [0, FADE_THRESHOLD],
        [1, FADE_OPACITY],
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
