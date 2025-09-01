import * as Haptics from "expo-haptics";

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

  static soft = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };

  static success = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  static selection = () => {
    Haptics.selectionAsync();
  };
}
