import { TIMING_CONFIG, SPRING_CONFIG } from "@/constants";
import * as Haptics from "expo-haptics";
import { LinearTransition } from "react-native-reanimated";

export class Feedback {
  static light() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  static medium() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  static heavy() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  static soft() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  }

  static success() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  static selection() {
    Haptics.selectionAsync();
  }
}

export const applySpringConfig = (
  animation: any,
  config: { damping: number; stiffness: number; mass?: number } = SPRING_CONFIG,
) => {
  return animation
    .springify()
    .damping(config.damping)
    .stiffness(config.stiffness)
    .mass(config.mass);
};

export const applyTimingConfig = (
  animation: any,
  config: { duration: number; easing?: (t: number) => number } = TIMING_CONFIG,
) => {
  return animation.duration(config.duration).easing(config.easing);
};

export const layoutConfig = applySpringConfig(LinearTransition);

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDegrees: number,
): { x: number; y: number } {
  const angleRad = ((angleDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

export function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}
