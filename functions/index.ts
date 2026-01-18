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
