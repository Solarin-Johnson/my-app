import { createContext, useContext, type ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const COLLAPSED_WIDTH = 194;
export const EXPANDED_HEIGHT = 75;
export const COLLAPSED_HEIGHT = 40;
export const SPACE = 20;
export const COLLAPSED_SPACE = 8;
export const EXPANDED_SPACE = 12;

export const SPRING_CONFIG = {
  stiffness: 210,
  damping: 24,
  mass: 1,
};

export const SPRING_CONFIG_SLOW = {
  stiffness: 180,
  damping: 22,
  mass: 1,
};

export const SPRING_CONFIG_BOUNCE = {
  stiffness: 200,
  damping: 20,
  mass: 1,
  restDisplacementThreshold: 0.000001,
  restSpeedThreshold: 0.000001,
};

export const applySpring = (toValue: number, callback?: () => void) => {
  "worklet";
  return withSpring(toValue, SPRING_CONFIG, callback);
};

interface DynamicToastContextType {
  expanded: SharedValue<boolean>;
  expandAnimationState: SharedValue<number>;
  pressed: SharedValue<boolean>;
  presented: SharedValue<boolean>;
  backdropPressed: SharedValue<boolean>;
}

export const DynamicToastContext =
  createContext<DynamicToastContextType | null>(null);

export function Provider({ children }: { children: ReactNode }) {
  const expanded = useSharedValue(false);
  const expandAnimationState = useSharedValue(0);
  const pressed = useSharedValue(false);
  const presented = useSharedValue(false);
  const backdropPressed = useSharedValue(false);

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: expanded.value ? "auto" : "none",
    };
  });

  useAnimatedReaction(
    () => expanded.value,
    (value) => {
      expandAnimationState.value = applySpring(value ? 1 : 0);
    },
  );

  return (
    <DynamicToastContext
      value={{
        expanded,
        expandAnimationState,
        pressed,
        presented,
        backdropPressed,
      }}
    >
      {children}
      <AnimatedPressable
        style={[StyleSheet.absoluteFill, overlayAnimatedStyle]}
        onPressIn={() => {
          expanded.value = false;
          backdropPressed.value = true;
        }}
        onPressOut={() => {
          backdropPressed.value = false;
        }}
      />
    </DynamicToastContext>
  );
}
export const useDynamicToast = () => {
  const context = useContext(DynamicToastContext);
  if (!context) {
    throw new Error(
      "useDynamicToast must be used within a DynamicToastProvider",
    );
  }
  return context;
};
