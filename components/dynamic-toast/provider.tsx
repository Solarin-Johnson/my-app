import { createContext, useContext, type ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DynamicToastContextType {
  expanded: SharedValue<boolean>;
  expandAnimationState: SharedValue<number>;
  pressed: SharedValue<boolean>;
  presented: SharedValue<boolean>;
}

export const DynamicToastContext =
  createContext<DynamicToastContextType | null>(null);

export function Provider({ children }: { children: ReactNode }) {
  const expanded = useSharedValue(false);
  const expandAnimationState = useSharedValue(0);
  const pressed = useSharedValue(false);
  const presented = useSharedValue(true);

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: expanded.value ? "auto" : "none",
    };
  });

  return (
    <DynamicToastContext
      value={{ expanded, expandAnimationState, pressed, presented }}
    >
      <AnimatedPressable
        style={[StyleSheet.absoluteFill, overlayAnimatedStyle]}
        onPressIn={() => {
          expanded.value = false;
        }}
      />
      {children}
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
