import { IconProps } from "@/components/icons";
import { useDimensions } from "@/hooks/useDimensions";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { svgPathProperties } from "svg-path-properties";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const PATH_LENGTH_ADJUSTMENT = 0;

export interface RadialProgressProps extends IconProps {
  progress: SharedValue<number>;
  radius?: number;
  fadeOpacity?: number;
  style?: StyleProp<ViewStyle>;
}

export const RadialProgress: React.FC<RadialProgressProps> = ({
  weight = 2,
  color = "black",
  size = 24,
  radius = 45,
  fadeOpacity = 0.3,
  progress,
  style,
}) => {
  const { width, height, viewBox } = useDimensions(100, 100, size);

  const getArc = (deg: number) => {
    const r = radius - weight;
    const cx = 50;
    const cy = 50;
    const startAngle = -90;
    const endAngle = startAngle + deg;
    const toRad = (d: number) => (d * Math.PI) / 180;

    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));

    const largeArcFlag = deg > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  const pathProps = {
    d: getArc(350),
    stroke: color,
    strokeWidth: weight * 2,
    strokeLinecap: "round",
    fill: "none",
  } as const;

  const pathLength = new svgPathProperties(pathProps.d).getTotalLength();

  console.log(pathLength);

  const animatedProps = useAnimatedProps(() => {
    console.log(progress.value);

    return {
      strokeDashoffset: pathLength * (1 - progress.value / 100),
    };
  });

  return (
    <Svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      style={style}
    >
      <Path {...pathProps} opacity={fadeOpacity} />
      <AnimatedPath
        animatedProps={animatedProps}
        {...pathProps}
        strokeDasharray={pathLength}
      />
    </Svg>
  );
};
