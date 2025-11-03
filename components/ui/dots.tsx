import { View, Text } from "react-native";
import React from "react";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

type DotsProps = {
  spacing?: number;
  dotSize?: number;
  color?: string;
};

export default function Dots({
  spacing = 20,
  dotSize = 2,
  color = "#999",
}: DotsProps) {
  return (
    <Svg height="100%" width="100%">
      <Defs>
        <Pattern
          id="dotPattern"
          patternUnits="userSpaceOnUse"
          width={spacing}
          height={spacing}
        >
          <Circle cx={spacing / 2} cy={spacing / 2} r={dotSize} fill={color} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#dotPattern)" />
    </Svg>
  );
}
