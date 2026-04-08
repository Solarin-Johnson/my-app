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
  width?: number;
  text?: string;
  strokeWidth?: number;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function FancyStrokeButton({
  progress,
  strokeColor = Colors.light.appleRed,
  height = 36,
  width = 45,
  text = "Record",
  strokeWidth = 2,
}: FancyStrokeButtonProps) {
  const r = height / 2;
  const inset = strokeWidth / 2;

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
    strokeWidth,
    fill: "none",
    transform: `translate(${inset}, 0)`,
  };

  const leftAnimatedProps = useAnimatedProps(() => {
    const completed = progress.get() === 1;
    return {
      strokeDashoffset: interpolate(progress.value, [0, 1], [leftLength, 0]),
      fill: withTiming(completed ? strokeColor : "transparent", {
        duration: completed ? 120 : 0,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  const rightAnimatedProps = useAnimatedProps(() => {
    const completed = progress.get() === 1;
    return {
      strokeDashoffset: interpolate(progress.value, [0, 1], [rightLength, 0]),
      fill: withTiming(completed ? strokeColor : "transparent", {
        duration: completed ? 120 : 0,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

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
        animatedProps={leftAnimatedProps}
      />
      <AnimatedPath
        d={getPath("right")}
        {...pathProps}
        transform={`translate(${width - inset}, 0)`}
        strokeDasharray={rightLength}
        animatedProps={rightAnimatedProps}
      />
      <AnimatedText
        x={width}
        y={height / 2 + inset}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize={15}
        fontWeight={"450"}
        animatedProps={animatedTextProps}
      >
        {text}
      </AnimatedText>
    </Svg>
  );
}
