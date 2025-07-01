import Svg, { Path } from "react-native-svg";

export interface IconProps {
  size?: number;
  color?: string;
  weight?: number;
}

export function LogoIcon(props: IconProps) {
  const { size = 218, color = "none" } = props;
  const width = (size / 218) * 249;
  return (
    <Svg width={width} height={size} viewBox="0 0 249 218" fill="none">
      <Path
        d="M0.920456 217.074V0.511365H62.5398V24.2045H30.5795V193.466H62.5398V217.074H0.920456ZM164.152 94.6023V120H85.5724V94.6023H164.152ZM248.761 0.511365V217.074H187.142V193.466H219.102V24.2045H187.142V0.511365H248.761Z"
        fill={color}
      />
    </Svg>
  );
}

export const ReloadIcon = (props: IconProps) => {
  const { size = 24, color = "none", weight = 2 } = props;
  return (
    <Svg width={size - 2} height={size - 2} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.4832 15.0001C16.4943 16.4802 15.0887 17.6337 13.4442 18.3149C11.7996 18.9961 9.99002 19.1743 8.24419 18.8271C6.49836 18.4798 4.89472 17.6226 3.63604 16.364C2.37737 15.1053 1.5202 13.5016 1.17294 11.7558C0.82567 10.01 1.0039 8.20038 1.68509 6.55585C2.36628 4.91131 3.51983 3.50571 4.99987 2.51677C6.47991 1.52784 8.21997 1 10 1C12.52 1 14.93 2 16.74 3.74L19 6M19 6V1M19 6H14"
        stroke={color}
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
