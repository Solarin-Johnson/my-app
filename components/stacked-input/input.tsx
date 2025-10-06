import { TextInput, StyleSheet, TextInputProps } from "react-native";
import React, { useCallback, useRef } from "react";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useStackedInput } from "./provider";
import { BlurView } from "expo-blur";
import { scheduleOnRN } from "react-native-worklets";
import { ThemedView, ThemedViewWrapper } from "../ThemedView";
import { ThemedTextWrapper } from "../ThemedText";

const TRANSFORM_DISTANCE = -6;
const SCALE_FACTOR = 0.95;
const MAX_VISIBLE = 2;
const NEXT_SCALE = 1.2;
const NEXT_TRANSFORM = -6;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const SPRING_CONFIG = {
  damping: 10,
  stiffness: 80,
  mass: 0.5,
};

const SPRING_CONFIG_INV = {
  damping: 10,
  stiffness: 80,
  mass: 1,
};

export default function Input({
  index,
  stackedInputRef,
  ...props
}: {
  index: number;
  stackedInputRef?: React.RefObject<TextInput>;
} & TextInputProps) {
  const { currentIndex } = useStackedInput();
  const _inputRef = useRef<TextInput>(null);
  const inputRef = stackedInputRef || _inputRef;
  const previousIndex = useSharedValue(0);

  const applySpring = (value: number) => {
    "worklet";
    const isGoingForward = currentIndex.value > previousIndex.value;

    const CONFIG = isGoingForward ? SPRING_CONFIG : SPRING_CONFIG_INV;
    return withSpring(value, CONFIG);
  };

  const intensity = useDerivedValue<number | undefined>(() => {
    const isNext = index > currentIndex.value;
    return applySpring(isNext ? 20 : 0);
  });

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useAnimatedReaction(
    () => currentIndex.value,
    (current, prev) => {
      const isCurrent = current === index;

      previousIndex.value = prev || 0;

      if (isCurrent) {
        scheduleOnRN(focusInput);
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    const isCurrent = index === currentIndex.value;
    const isPrevious = index < currentIndex.value;
    const isNext = index > currentIndex.value;
    const distance = currentIndex.value - index;
    const factor = Math.max(-MAX_VISIBLE, Math.min(MAX_VISIBLE, distance));

    return {
      transform: [
        {
          translateY: applySpring(
            (isNext ? NEXT_TRANSFORM : factor) * TRANSFORM_DISTANCE
          ),
        },
        {
          scale: applySpring(
            isCurrent
              ? 1
              : isNext
              ? NEXT_SCALE
              : SCALE_FACTOR ** Math.abs(factor)
          ),
        },
      ],
      pointerEvents: isCurrent ? "auto" : "box-only",
      opacity: applySpring(isNext || Math.abs(factor) > MAX_VISIBLE ? 0 : 1),
    };
  });

  const blurAnimatedStyle = useAnimatedStyle(() => {
    const isNext = index > currentIndex.value;
    return { display: isNext ? "flex" : "none" };
  });

  const onFocus = useCallback((e: any) => {
    props.onFocus?.(e);
    currentIndex.value = index;
  }, []);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ThemedView style={[styles.block, styles.rounded]}>
        <ThemedTextWrapper>
          <TextInput
            ref={inputRef}
            placeholder="Type here..."
            style={styles.text}
            {...props}
            onFocus={onFocus}
          />
        </ThemedTextWrapper>
      </ThemedView>
      <AnimatedBlurView
        intensity={intensity}
        style={[StyleSheet.absoluteFill, styles.rounded, blurAnimatedStyle]}
        pointerEvents={"none"}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  block: {
    borderWidth: 1,
    borderColor: "#88888899",
    fontSize: 16,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  text: {
    padding: 14,
    fontSize: 16,
    width: "100%",
    height: "100%",
    fontWeight: "500",
  },
  rounded: {
    borderRadius: 14,
    borderCurve: "continuous",
  },
  container: {
    right: 0,
    left: 0,
    position: "absolute",
    height: 50,
  },
});
