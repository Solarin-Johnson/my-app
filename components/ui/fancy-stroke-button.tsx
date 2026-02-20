import Animated, { SharedValue } from "react-native-reanimated";
import Svg, { Path, Text } from "react-native-svg";
import { ThemedTextWrapper } from "../ThemedText";

interface FancyStrokeButtonProps {
  progress: SharedValue<number>;
}

const width = 45;
const height = 35;
const r = height / 2;
const stroke = 2;
const inset = stroke / 2;

const k = 0.7;
const c = r * k;

const getPath = (direction: "left" | "right") => {
  const isRight = direction === "right";
  const xStart = isRight ? width - inset : inset;
  const xEnd = isRight ? r + inset : width - r - inset;
  const xControl = isRight ? r - c + inset : width - r + c - inset;
  const xEdge = isRight ? inset : width - inset;

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

export default function RecordPage({ progress }: FancyStrokeButtonProps) {
  return (
    <Svg width={width * 2} height={height}>
      <ThemedTextWrapper attribute="fill">
        <Text
          x={width}
          y={height / 2 + stroke / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={14}
          fontWeight={"450"}
        >
          Record
        </Text>
      </ThemedTextWrapper>
      <Path
        d={getPath("right")}
        stroke="red"
        strokeWidth={stroke}
        fill="none"
        transform={`translate(1, 0)`}
      />
      <Path
        d={getPath("left")}
        stroke="red"
        strokeWidth={stroke}
        fill="none"
        transform={`translate(${width - 1}, 0)`}
      />
    </Svg>
  );
}
