import { SharedValue } from "react-native-reanimated";

export const SPRING_CONFIG = {
  damping: 10,
  stiffness: 90,
  mass: 0.5,
};

export type ReCaptchaProps = {
  shrinkProgress: SharedValue<number>;
  isVerified: SharedValue<boolean>;
};
