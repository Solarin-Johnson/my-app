import { IconProps } from "@/components/icons";
import { useDimensions } from "@/hooks/useDimensions";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

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
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset =
      circumference - (progress.value / 100) * circumference;
    return {
      strokeDashoffset,
    };
  });

  const pathProps = {
    d: `M50 ${50 - radius + weight} a ${radius - weight} ${
      radius - weight
    } 0 1 1 0 ${2 * (radius - weight)} a ${radius - weight} ${
      radius - weight
    } 0 1 1 0 -${2 * (radius - weight)}`,
    stroke: color,
    strokeWidth: weight * 2,
    strokeLinecap: "round",
    fill: "none",
  } as const;

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
        strokeDasharray={circumference}
      />
    </Svg>
  );
};
