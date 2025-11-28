import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
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
import { Pause, Play, Volume2 } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import PressableBounce from "./PresableBounce";

const isLiquidGlass = isLiquidGlassAvailable();
const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

const DURATION = 30000;
const COLLAPSED_HEIGHT = 54;
const EXPANDED_HEIGHT = 70;
const PADDING = 16;
const ICON_WIDTH = 36;
const WIDTH = 320;
const ADJUSTMENT = 11;
const EXPANDED_SLIDER_WIDTH = WIDTH - 2 * PADDING - ADJUSTMENT;
const SLIDER_WIDTH = EXPANDED_SLIDER_WIDTH - 2 * ICON_WIDTH + ADJUSTMENT;

export default function PlaybackControl() {
  const value = useSharedValue(0);
  const pressed = useSharedValue(false);
  const scrubbing = useSharedValue(false);
  const expanded = useSharedValue(false);
  const text = useThemeColor("text");
  const delayTimeout = useSharedValue(0);
  const lastValueOnPress = useSharedValue(value.value);
  const playing = useSharedValue(true);
  const previousPlaying = useSharedValue(false);
  const internalAnimating = useSharedValue(false);

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

  useAnimatedReaction(
    () => ({ pressed: pressed.value, scrubbing: scrubbing.value }),
    ({ pressed: p, scrubbing: s }, prev) => {
      // Handle pressed changes
      if (prev && p !== prev.pressed) {
        if (p) {
          expanded.value = true;
          lastValueOnPress.value = value.value;
          previousPlaying.value = playing.value;
          playing.value = false;
        } else {
          if (
            value.value === 0 ||
            value.value === DURATION ||
            value.value === lastValueOnPress.value
          ) {
            expanded.value = false;
            return;
          }
        }
      }
      // Handle scrubbing changes
      if (previousPlaying.value && !s) {
        playing.value = true;
      }
      if (!s && !p && value.value !== 0 && value.value !== DURATION) {
        expanded.value = false;
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

  useAnimatedReaction(
    () => ({ isPlaying: playing.value, v: value.value }),
    ({ isPlaying, v }, prev) => {
      const prevPlaying = prev?.isPlaying;

      if (!isPlaying && prevPlaying) {
        cancelAnimation(value);
        internalAnimating.value = false;
        return;
      }

      if (!isPlaying) return;

      if (v >= DURATION) {
        playing.value = false;
        internalAnimating.value = false;
        return;
      }

      if (internalAnimating.value) return;

      internalAnimating.value = true;
      const remaining = DURATION - v;

      value.value = withTiming(
        DURATION,
        { duration: remaining, easing: Easing.linear },
        (finished) => {
          internalAnimating.value = false;
          if (finished) playing.value = false;
        }
      );
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

  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: expanded.value ? "none" : "auto",
      ...getOpacityStyle(!expanded.value),
    };
  });
  const timeAnimatedStyle = useAnimatedStyle(() =>
    getOpacityStyle(expanded.value, expanded.value ? 120 : 0, {})
  );

  const playAnimatedStyle = useAnimatedStyle(() =>
    getOpacityStyle(!playing.value, 0, { duration: 0 })
  );

  const pauseAnimatedStyle = useAnimatedStyle(() =>
    getOpacityStyle(playing.value, 0, { duration: 0 })
  );

  const Wrapper = isLiquidGlass ? AnimatedGlassView : Animated.View;

  useEffect(() => {
    playing.value = true;
    return () => {
      playing.value = false;
    };
  }, []);

  const onPausePress = React.useCallback(() => {
    playing.value = !playing.value;
    if (value.value >= DURATION) {
      value.value = 0;
      playing.value = true;
    }
  }, []);

  return (
    <Wrapper
      style={[
        styles.wrapper,
        {
          backgroundColor: isLiquidGlass ? "transparent" : "#FFFFFF20",
        },
        controlAnimatedStyle,
      ]}
    >
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
          <AnimatedText
            text={remainingTime}
            style={[
              styles.time,
              {
                textAlign: "right",
              },
            ]}
          />
        </ThemedTextWrapper>
      </Animated.View>
      <Animated.View
        style={[styles.buttons, buttonsAnimatedStyle, topAnimatedStyle]}
      >
        <TouchableOpacity
          onPress={onPausePress}
          style={styles.toggleButton}
          activeOpacity={0.8}
        >
          <Animated.View style={[styles.toggleIcon, pauseAnimatedStyle]}>
            <Pause size={26} fill={text} stroke={"none"} />
          </Animated.View>
          <Animated.View style={[styles.toggleIcon, playAnimatedStyle]}>
            <Play size={22} fill={text} color={text} />
          </Animated.View>
        </TouchableOpacity>
        <PressableBounce bounceScale={0.85}>
          <Volume2 size={24} stroke={text} />
        </PressableBounce>
      </Animated.View>
      <Animated.View style={[styles.slider, sliderAnimatedStyle]}>
        <Slider
          value={value}
          max={DURATION}
          trackColor="#FFFFFF50"
          thumbColor="#FFFFFF"
          pressed={pressed}
          scrubbing={scrubbing}
        />
      </Animated.View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 14,
    borderRadius: 24,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
    width: WIDTH,
  },
  slider: {
    cursor: "grabbing" as any,
  },
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
    pointerEvents: "none",
  },
  time: {
    fontVariant: ["tabular-nums"],
    fontSize: 13.5,
    maxWidth: 70,
    cursor: "default",
  },
  toggleButton: {
    justifyContent: "center",
    alignItems: "center",
    width: ICON_WIDTH - 6,
  },
  toggleIcon: {
    position: "absolute",
  },
});
