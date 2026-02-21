import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path, PathProps, Text } from "react-native-svg";
import { svgPathProperties } from "svg-path-properties";
import { Colors } from "@/constants/Colors";

interface FancyStrokeButtonProps {
  progress: SharedValue<number>;
  strokeColor?: string;
  height?: number;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function FancyStrokeButton({
  progress,
  strokeColor = Colors.light.appleRed,
  height = 38,
}: FancyStrokeButtonProps) {
  const width = 50;
  const r = height / 2;
  const stroke = 2;
  const inset = stroke / 2;

  const k = 0.7;
  const c = r * k;

  const getPath = (direction: "left" | "right") => {
    const isLeft = direction === "left";
    const xStart = isLeft ? width - inset : inset;
    const xEnd = isLeft ? r + inset : width - r - inset;
    const xControl = isLeft ? r - c + inset : width - r + c - inset;
    const xEdge = isLeft ? inset : width - inset;

    return `
            M ${xStart} ${height - inset}
            H ${xEnd}
            C ${xControl} ${height - inset}
                ${xEdge} ${height - (r - c)}
                ${xEdge} ${height - r}
            V ${r}
            C ${xEdge} ${r - c}
                ${xControl} ${inset}
                ${xEnd} ${inset}
            H ${xStart}
        `;
  };

  const leftLength = new svgPathProperties(getPath("left")).getTotalLength();
  const rightLength = new svgPathProperties(getPath("right")).getTotalLength();

  const pathProps: PathProps = {
    stroke: strokeColor,
    strokeWidth: stroke,
    fill: "none",
    transform: `translate(1, 0)`,
  };

  const getAnimatedProps = (direction: "left" | "right") => {
    return useAnimatedProps(() => {
      const completed = progress.get() === 1;
      return {
        strokeDashoffset: interpolate(
          progress.value,
          [0, 1],
          [direction === "left" ? leftLength : rightLength, 0],
        ),
        fill: withTiming(completed ? strokeColor : "transparent", {
          duration: completed ? 120 : 0,
          easing: Easing.inOut(Easing.ease),
        }),
      };
    });
  };

  const animatedTextProps = useAnimatedProps(() => {
    const completed = progress.get() === 1;
    return {
      opacity: interpolate(
        progress.value,
        [0, 0.5, 1],
        [0, 0.8, 1],
        Extrapolation.CLAMP,
      ),
      fill: withTiming(completed ? "#fff" : strokeColor, {
        duration: completed ? 120 : 0,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  return (
    <Svg width={width * 2} height={height}>
      <AnimatedPath
        d={getPath("left")}
        {...pathProps}
        strokeDasharray={leftLength}
        animatedProps={getAnimatedProps("right")}
      />
      <AnimatedPath
        d={getPath("right")}
        {...pathProps}
        transform={`translate(${width - 1}, 0)`}
        strokeDasharray={rightLength}
        animatedProps={getAnimatedProps("left")}
      />
      <AnimatedText
        x={width}
        y={height / 2 + stroke / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={16}
        fontWeight={"450"}
        animatedProps={animatedTextProps}
      >
        Record
      </AnimatedText>
    </Svg>
  );
}
