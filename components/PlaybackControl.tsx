import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  cancelAnimation,
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
import { ThemedTextWrapper } from "./ThemedText";
import { AnimatedText } from "./ui/animated-text";
import Slider from "./Slider";
import { Pause, Volume2 } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

const DURATION = 30000;
const COLLAPSED_HEIGHT = 54;
const EXPANDED_HEIGHT = 70;
const PADDING = 16;
const ICON_WIDTH = 36;
const WIDTH = 320;
const ADJUSTMENT = 11;
const EXPANDED_SLIDER_WIDTH = WIDTH - 2 * PADDING - ADJUSTMENT;
const SLIDER_WIDTH = EXPANDED_SLIDER_WIDTH - 2 * ICON_WIDTH + ADJUSTMENT;

const SPRING_CONFIG = {
  stiffness: 180,
  damping: 28,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.000001,
  restSpeedThreshold: 0.000001,
};

export default function PlaybackControl() {
  const value = useSharedValue(0);
  const pressed = useSharedValue(false);
  const expanded = useSharedValue(false);
  const delayProgress = useSharedValue(0);
  const text = useThemeColor("text");

  const valueToTime = useDerivedValue(() => {
    const totalMilliseconds = value.value;
    const hours = Math.floor(totalMilliseconds / (60 * 60 * 1000));
    const minutes = Math.floor(
      (totalMilliseconds % (60 * 60 * 1000)) / (60 * 1000)
    );
    const seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);
    const milliseconds = totalMilliseconds % 1000;

    const minStr = minutes.toString().padStart(2, "0");
    const secStr = seconds.toString().padStart(2, "0");
    const msStr = `.${Math.floor(milliseconds / 10)
      .toString()
      .padStart(2, "0")}`;

    return `${minStr}:${secStr}${msStr}`;
  }, [value]);

  const remainingTime = useDerivedValue(() => {
    const remainingMilliseconds = DURATION - value.value;
    const minutes = Math.floor(remainingMilliseconds / (60 * 1000));
    const seconds = Math.floor((remainingMilliseconds % (60 * 1000)) / 1000);

    const minStr = minutes.toString().padStart(2, "0");
    const secStr = seconds.toString().padStart(2, "0");

    return `-${minStr}:${secStr}`;
  }, [value]);

  const delayTimeout = useSharedValue(0);

  const lastValueOnPress = useSharedValue(value.value);

  useAnimatedReaction(
    () => pressed.value,
    (p, prev) => {
      if (p !== prev) {
        if (delayTimeout.value) {
          cancelAnimation(delayTimeout);
          delayTimeout.value = 0;
        }

        if (p) {
          expanded.value = true;
          lastValueOnPress.value = value.value; // store value on press
        } else {
          if (
            value.value === 0 ||
            value.value === DURATION ||
            value.value === lastValueOnPress.value
          ) {
            expanded.value = false;
            return;
          }

          delayTimeout.value = withDelay(
            500,
            withTiming(0, { duration: 0 }, () => {
              if (
                !pressed.value &&
                value.value !== 0 &&
                value.value !== DURATION
              ) {
                expanded.value = false;
              }
              delayTimeout.value = 0;
            })
          );
        }
      }
    }
  );

  useAnimatedReaction(
    () => value.value,
    (v, prev) => {
      if (pressed.value) return;

      if (v === 0 || v === DURATION) {
        if (delayTimeout.value) {
          cancelAnimation(delayTimeout);
          delayTimeout.value = 0;
        }
        expanded.value = false;
      }
    }
  );
  const controlAnimatedStyle = useAnimatedStyle(() => {
    const isExpanded = expanded.value;

    return {
      height: withSpring(isExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT),
    };
  });

  const sliderAnimatedStyle = useAnimatedStyle(() => {
    const isExpanded = expanded.value;
    return {
      width: withSpring(isExpanded ? EXPANDED_SLIDER_WIDTH : SLIDER_WIDTH),
      transform: [
        {
          translateY: withSpring(isExpanded ? ADJUSTMENT : 0),
        },
      ],
    };
  });

  const topAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(expanded.value ? -ADJUSTMENT : 0),
        },
      ],
    };
  });

  const getOpacityStyle = (value: boolean, delay: number = 0, config = {}) => {
    "worklet";
    return {
      opacity: withDelay(
        delay,
        withTiming(value ? 1 : 0, {
          duration: 200,
          easing: Easing.inOut(Easing.ease),
          ...config,
        })
      ),
    };
  };

  const buttonsAnimatedStyle = useAnimatedStyle(() =>
    getOpacityStyle(!expanded.value)
  );
  const timeAnimatedStyle = useAnimatedStyle(() =>
    getOpacityStyle(expanded.value, expanded.value ? 120 : 0, {})
  );

  return (
    <Animated.View style={[styles.wrapper, controlAnimatedStyle]}>
      <Animated.View
        style={[styles.buttons, buttonsAnimatedStyle, topAnimatedStyle]}
      >
        <Pause size={24} fill={text} stroke={"none"} />
        <Volume2 size={24} stroke={text} />
      </Animated.View>
      <Animated.View
        style={[
          styles.buttons,
          styles.timeContainer,
          timeAnimatedStyle,
          topAnimatedStyle,
        ]}
      >
        <ThemedTextWrapper>
          <AnimatedText text={valueToTime} style={styles.time} />
        </ThemedTextWrapper>
        <ThemedTextWrapper>
          <AnimatedText text={remainingTime} style={styles.time} />
        </ThemedTextWrapper>
      </Animated.View>
      <Animated.View style={[styles.slider, sliderAnimatedStyle]}>
        <Slider
          value={value}
          max={DURATION}
          trackColor="#FFFFFF50"
          thumbColor="#FFFFFF"
          pressed={pressed}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#ffffff10",
    padding: 14,
    borderRadius: 24,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
    width: WIDTH,
  },
  slider: {},
  buttons: {
    position: "absolute",
    right: PADDING,
    left: PADDING,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "blue",
    height: ICON_WIDTH,
  },
  timeContainer: {
    paddingHorizontal: 6,
  },
  time: {
    fontVariant: ["tabular-nums"],
    fontSize: 13,
  },
});
