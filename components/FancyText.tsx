import React, { useCallback, useLayoutEffect } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  createAnimatedComponent,
  Easing,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedText, ThemedTextProps } from "./ThemedText";
import { useFocusEffect } from "expo-router";

const AnimatedText = createAnimatedComponent(ThemedText);

export const SPRING_CONFIG = {
  damping: 50,
  stiffness: 400,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.0001,
  restSpeedThreshold: 0.0001,
};

interface FancyTextProps {
  words: string[];
  currentIndex?: SharedValue<number>;
  bounce?: boolean;
  style?: StyleProp<ViewStyle>;
  textProps?: ThemedTextProps;
  offsetY?: SharedValue<number>;
  duration?: SharedValue<number>;
  delay?: SharedValue<number>;
  scale?: SharedValue<number>;
  dynamicDelay?: SharedValue<boolean>;
  initOffsetY?: number;
  initDuration?: number;
  initDelay?: number;
  initScale?: number;
  initIndex?: number;
  initDynamicDelay?: boolean;
}

const AnimatedThemedText = createAnimatedComponent(ThemedText);

export default function FancyText({
  words,
  currentIndex: _currentIndex,
  bounce = true,
  style,
  textProps,
  offsetY: _offsetY,
  duration: _duration,
  delay: _delay,
  scale: _scale,
  dynamicDelay: _dynamicDelay,
  initOffsetY = 10,
  initDuration = 300,
  initDelay = 20,
  initIndex = 0,
  initScale = 0.8,
  initDynamicDelay = true,
}: FancyTextProps) {
  const currentIndex = useDerivedValue(() => {
    return _currentIndex?.value ?? initIndex;
  });

  const offsetY = useDerivedValue(() => {
    return _offsetY?.value ?? initOffsetY;
  });

  const duration = useDerivedValue(() => {
    return _duration?.value ?? initDuration;
  });

  const scale = useDerivedValue(() => {
    return _scale?.value ?? initScale;
  });

  const dynamicDelay = useDerivedValue(() => {
    return _dynamicDelay?.value ?? initDynamicDelay;
  });

  const charDelay = useDerivedValue(() => {
    return dynamicDelay.value
      ? duration.value / 15
      : _delay?.value ?? initDelay;
  });
  return (
    <View style={[styles.container, style]}>
      {words.map((word, wordIndex) => (
        <View key={`word-${wordIndex}`} style={styles.word}>
          {word.split("").map((char, charIndex) => (
            <Character
              key={`char-${charIndex}`}
              char={char}
              wordIndex={wordIndex}
              charIndex={charIndex}
              currentIndex={currentIndex}
              words={words}
              bounce={bounce}
              textProps={textProps}
              duration={duration}
              offsetY={offsetY}
              charDelay={charDelay}
              scale={scale}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const Character = ({
  char,
  currentIndex,
  wordIndex,
  charIndex,
  words,
  bounce = true,
  textProps,
  duration,
  offsetY,
  charDelay,
  scale,
}: {
  char: string;
  currentIndex: SharedValue<number>;
  wordIndex: number;
  charIndex: number;
  words?: string[];
  bounce?: boolean;
  textProps?: ThemedTextProps;
  duration: SharedValue<number>;
  offsetY: SharedValue<number>;
  charDelay: SharedValue<number>;
  scale: SharedValue<number>;
}) => {
  const prevIndex = useSharedValue(0);
  const mounted = useSharedValue(false);

  const applyAnimation = (value: number) => {
    "worklet";
    return withTiming(value, {
      duration: duration.value,
      easing: Easing.out(Easing.ease),
    });
  };

  useDerivedValue(() => {
    mounted.value = true;
  });

  useAnimatedReaction(
    () => currentIndex.value,
    (value, prev) => {
      if (prev) {
        prevIndex.value = prev;
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    const isActive = currentIndex.value === wordIndex && mounted.value;
    const totalDelay = duration.value;

    const delay = (isActive ? totalDelay : 0) + charDelay.value * charIndex;
    return {
      opacity: withDelay(
        delay - charDelay.value,
        applyAnimation(isActive ? (textProps?.style as any)?.opacity || 1 : 0)
      ),
      transform: bounce
        ? [
            {
              translateY: withDelay(
                delay,
                applyAnimation(isActive ? 0 : offsetY.value)
              ),
            },
            {
              scale: withDelay(
                delay,
                applyAnimation(
                  currentIndex.value === wordIndex ? 1 : scale.value
                )
              ),
            },
          ]
        : [],
    };
  });
  return (
    <AnimatedText
      key={`${char}-${wordIndex}-${charIndex}`}
      type="italic"
      {...textProps}
      style={[styles.text, textProps?.style, animatedStyle]}
    >
      {char}
    </AnimatedText>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 40,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  word: {
    flexDirection: "row",
    position: "absolute",
  },
  text: {
    fontSize: 28,
    transformOrigin: "bottom",
  },
});
