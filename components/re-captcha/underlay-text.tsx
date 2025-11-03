import React from "react";
import { Svg, Text as SvgText, Circle } from "react-native-svg";

const HORIZONTAL_SHIFT = 30;
const DOT_OFFSET_X = 10;
const DOT_OFFSET_Y = 10;
const FONT_SIZE = 10;
const DOT_RADIUS = 3;

type DotPosition = "up" | "right" | "left" | "under";

type NumberWithCoord = {
  num: number;
  x: number;
  y: number;
  dot: DotPosition;
};

const numbersWithCoords: NumberWithCoord[] = [
  { num: 1, x: 20 + HORIZONTAL_SHIFT, y: 150, dot: "right" },
  { num: 2, x: 20 + HORIZONTAL_SHIFT, y: 50, dot: "right" },
  { num: 3, x: 80 + HORIZONTAL_SHIFT, y: 130, dot: "up" },
  { num: 4, x: 110 + HORIZONTAL_SHIFT, y: 20, dot: "under" },
  { num: 5, x: 135 + HORIZONTAL_SHIFT, y: 125, dot: "up" },
  { num: 6, x: 175 + HORIZONTAL_SHIFT, y: 40, dot: "left" },
  { num: 7, x: 190 + HORIZONTAL_SHIFT, y: 150, dot: "left" },
  { num: 8, x: 15 + HORIZONTAL_SHIFT, y: 180, dot: "right" },
];

function getTextCenterY(y: number) {
  return y - FONT_SIZE / 3;
}

function getDotCoords(
  x: number,
  y: number,
  position: DotPosition
): { cx: number; cy: number } {
  const centerY = getTextCenterY(y);
  switch (position) {
    case "left":
      return { cx: x - DOT_OFFSET_X, cy: centerY };
    case "right":
      return { cx: x + DOT_OFFSET_X, cy: centerY };
    case "up":
      return { cx: x, cy: centerY - DOT_OFFSET_Y };
    case "under":
      return { cx: x, cy: centerY + DOT_OFFSET_Y };
    default:
      return { cx: x, cy: y };
  }
}

type UnderlayTextProps = {
  textColor?: string;
  dotColor?: string;
  color?: string;
};

export default function UnderlayText({
  textColor,
  dotColor,
  color = "black",
}: UnderlayTextProps) {
  return (
    <Svg height="100%" width="100%">
      {numbersWithCoords.map(({ num, x, y, dot }) => {
        const { cx, cy } = getDotCoords(x, y, dot);
        return (
          <React.Fragment key={num}>
            <SvgText
              x={x}
              y={y}
              fontSize={FONT_SIZE}
              fill={textColor || color}
              textAnchor="middle"
              fontWeight="600"
              fontFamily="AvenirNextRounded-Regular"
            >
              {num}
            </SvgText>
            <Circle cx={cx} cy={cy} r={DOT_RADIUS} fill={dotColor || color} />
          </React.Fragment>
        );
      })}
    </Svg>
  );
}
