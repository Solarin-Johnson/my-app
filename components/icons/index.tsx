import Svg, { Path } from "react-native-svg";

export interface IconProps {
  size?: number;
  fill?: string;
}

export function LogoIcon(props: IconProps) {
  const { size = 218, fill = "none" } = props;
  const width = (size / 218) * 249;
  return (
    <Svg width={width} height={size} viewBox="0 0 249 218" fill={fill}>
      <Path d="M0.920456 217.074V0.511365H62.5398V24.2045H30.5795V193.466H62.5398V217.074H0.920456ZM164.152 94.6023V120H85.5724V94.6023H164.152ZM248.761 0.511365V217.074H187.142V193.466H219.102V24.2045H187.142V0.511365H248.761Z" />
    </Svg>
  );
}
