import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useEffect } from "react";
import { GlassView } from "expo-glass-effect";
import { ThemedText } from "../ThemedText";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export type Cords = { x: number; y: number; width: number; height: number };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

const PADDING = 16;
const FULL_HEIGHT = 350;
const CLOSED_HEIGHT = 45;
export const ANIMATION_DELAY = 340;
const SPRING_CONFIG = {
  stiffness: 300,
  damping: 30,
  mass: 1,
  overshootClamping: true,
};

const applySpring = (value: number) => {
  "worklet";
  return withSpring(value, SPRING_CONFIG);
};

export default function Island({
  onPress,
  modal = false,
  containerRef,
  visible = true,
  cords,
  opened: openedProp,
}: {
  onPress?: (e: GestureResponderEvent) => void;
  modal?: boolean;
  containerRef?: React.RefObject<any>;
  visible?: boolean;
  cords?: SharedValue<Cords>;
  opened?: SharedValue<boolean>;
}) {
  const { width } = useWindowDimensions();
  const FULL_WIDTH = width - PADDING * 2;
  const _opened = useSharedValue(false);
  const opened = openedProp || _opened;

  useEffect(() => {
    opened.value = true;
  }, []);

  useDerivedValue(() => {});

  const animatedStyle = useAnimatedStyle(() => {
    const { x, y, width, height } = cords?.value || {};
    const isOpened = opened.value;

    const modalStyle = modal
      ? {
          position: "absolute" as const,
          left: applySpring(isOpened ? PADDING : x || 0),
          width: applySpring(isOpened ? FULL_WIDTH : width || 0),
          height: applySpring(isOpened ? FULL_HEIGHT : height || 0),
        }
      : {};
    return {
      opacity: visible ? 1 : 0,
      ...modalStyle,
    };
  });

  return (
    <AnimatedGlassView
      glassEffectStyle="regular"
      isInteractive={!modal}
      style={[styles.glass, animatedStyle]}
      // tintColor={"#ffffff08"}
    >
      <AnimatedPressable
        onPress={onPress}
        style={{ flex: 1, padding: 8 }}
        ref={containerRef}
        pointerEvents={modal ? "box-none" : "auto"}
      >
        <ThemedText>Island</ThemedText>
      </AnimatedPressable>
    </AnimatedGlassView>
  );
}

const styles = StyleSheet.create({
  glass: {
    flex: 1,
    // width: 400,
    height: CLOSED_HEIGHT,
    marginRight: 48,
    borderCurve: "continuous",
    borderRadius: CLOSED_HEIGHT / 2,
  },
});
