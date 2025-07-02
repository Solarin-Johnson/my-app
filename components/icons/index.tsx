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
    <Svg width={size - 1} height={size - 1} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.4832 17.0001C18.4943 18.4802 17.0887 19.6337 15.4442 20.3149C13.7996 20.9961 11.99 21.1743 10.2442 20.8271C8.49836 20.4798 6.89472 19.6226 5.63604 18.364C4.37737 17.1053 3.5202 15.5016 3.17294 13.7558C2.82567 12.01 3.0039 10.2004 3.68509 8.55585C4.36628 6.91131 5.51983 5.50571 6.99987 4.51677C8.47991 3.52784 10.22 3 12 3C14.52 3 16.93 4 18.74 5.74L21 8M21 8V3M21 8H16"
        stroke={color}
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
