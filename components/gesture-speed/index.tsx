import { View, StyleSheet, useWindowDimensions } from "react-native";
import React from "react";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import LoopingIcon from "./looping-icon";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Feedback } from "@/functions";
import { UIAnimatedText } from "../ui/ui-animated-text";
import FancyStrokeButton from "../ui/fancy-stroke-button";
import { runOnJS } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedTextWrapper } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Lock } from "lucide-react-native";

const THRESHOLD = 64;
const LOCK_THRESHOLD = 80;
const ACTIVATE_LOCK_THRESHOLD = 5;
const WIDTH = 90;
const TRANSLATE_Y_ENTRY = 15;
const MAX_TRANSLATE_Y = 200;
const LEFT_ICON_WIDTH = 20;
const RIGHT_ICON_WIDTH = 24;

const feedback = () => {
  Feedback.light();
};

const feedbackSoft = () => {
  Feedback.selection();
};

export const SPRING_CONFIG = {
  damping: 40,
  mass: 0.7,
  stiffness: 120,
};

export const SPRING_CONFIG_FAST = {
  damping: 38,
  mass: 0.65,
  stiffness: 150,
};

export const SPRING_CONFIG_SNAP = {
  damping: 35,
  mass: 0.25,
  stiffness: 300,
};

const PULSE_SPRING_CONFIG = {
  damping: 14,
  stiffness: 220,
  mass: 0.8,
  restDisplacementThreshold: 0.0001,
  restSpeedThreshold: 0.0001,
};

const applySpring = (
  value: number,
  type?: "default" | "pulse" | "snap" | "fast",
) => {
  "worklet";
  return withSpring(
    value,
    type === "pulse"
      ? PULSE_SPRING_CONFIG
      : type === "snap"
        ? SPRING_CONFIG_SNAP
        : type === "fast"
          ? SPRING_CONFIG_FAST
          : SPRING_CONFIG,
  );
};

export default function GestureSpeed() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isVisible = useSharedValue(false);
  const locked = useSharedValue(false);
  const dragging = useSharedValue(false);

  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const MARGIN = top + bottom;
  const MAX_HEIGHT = height - MARGIN - 100;

  const lockProgress = useDerivedValue(() => {
    return interpolate(
      translateY.value,
      [0, LOCK_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP,
    );
  });

  const panGesture = usePanGesture({
    maxPointers: 1,
    onActivate: () => {
      runOnJS(feedback)();
      isVisible.value = true;
      translateY.value = 0;
      translateX.value = 0;
      dragging.value = true;
      locked.value = false;
    },
    onUpdate: (e) => {
      if (translateY.value < ACTIVATE_LOCK_THRESHOLD) {
        translateX.value = e.translationX;
      }
      translateY.value = Math.max(0, e.translationY - TRANSLATE_Y_ENTRY);
      console.log(e.translationX);
    },
    onDeactivate: () => {
      dragging.value = false;
      translateY.value = applySpring(0);
      if (lockProgress.value !== 1) {
        isVisible.value = false;
        translateX.value = 0;
      }
      if (lockProgress.value === 1) {
        locked.value = true;
      }
    },
    activateAfterLongPress: 300,
  });

  const speed = useDerivedValue(() => {
    return interpolate(
      translateX.value,
      [-THRESHOLD, 0, THRESHOLD],
      [1.1, 2, 3],
      Extrapolation.CLAMP,
    ).toFixed(1);
  });

  useAnimatedReaction(
    () => lockProgress.value,
    (progress) => {
      if (progress === 1) {
        runOnJS(feedback)();
      } else if (progress === 0 && dragging.value) {
        runOnJS(feedbackSoft)();
      }
    },
  );

  const buttonProgress = useDerivedValue(() => {
    if (locked.value) {
      return 1;
    }
    return lockProgress.value;
  });

  const indictorTranslateY = useDerivedValue(() => {
    return interpolate(
      translateY.value,
      [0, MAX_TRANSLATE_Y, MAX_HEIGHT],
      [0, MAX_TRANSLATE_Y * 0.5, MAX_TRANSLATE_Y],
      Extrapolation.CLAMP,
    );
  });

  const indicatorLocked = useDerivedValue(() => {
    return lockProgress.value === 1 || locked.value;
  });

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    const isLocked = lockProgress.value === 1 && dragging.value;
    return {
      transform: [
        {
          translateY: indictorTranslateY.value,
        },
        {
          scale: applySpring(
            isLocked ? 1.14 : isVisible.value ? 1 : 0.75,
            isLocked ? "pulse" : "snap",
          ),
        },
      ],
      opacity: applySpring(isVisible.value ? 1 : 0, "snap"),
    };
  });

  const lockIconAnimatedStyle = useAnimatedStyle(() => {
    const isVisible = indicatorLocked.value;

    return {
      opacity: withTiming(isVisible ? 1 : 0, { duration: 100 }),
      width: applySpring(isVisible ? LEFT_ICON_WIDTH : 0, "fast"),
      transform: [
        {
          translateX: applySpring(isVisible ? 0 : LEFT_ICON_WIDTH / 4, "fast"),
        },
      ],
    };
  });

  const loopIconAnimatedStyle = useAnimatedStyle(() => {
    const isVisible = !indicatorLocked.value;
    return {
      opacity: withTiming(isVisible ? 1 : 0, { duration: 100 }),
      width: applySpring(isVisible ? RIGHT_ICON_WIDTH : 0, "fast"),
      transform: [
        {
          translateX: applySpring(
            isVisible ? 0 : -RIGHT_ICON_WIDTH / 4,
            "fast",
          ),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <Animated.View style={[styles.speedIndicator, indicatorAnimatedStyle]}>
          <View style={StyleSheet.absoluteFill}>
            <ThemedTextWrapper attribute="strokeColor" colorName="gestureBtnBg">
              <FancyStrokeButton
                progress={buttonProgress}
                text=""
                width={WIDTH / 2}
                strokeWidth={2.4}
              />
            </ThemedTextWrapper>
          </View>
          <Animated.View style={[styles.leftIcon, lockIconAnimatedStyle]}>
            <ThemedTextWrapper>
              <Lock size={16} strokeWidth={2.6} />
            </ThemedTextWrapper>
          </Animated.View>
          <UIAnimatedText text={speed} />
          <Animated.View style={[styles.rightIcon, loopIconAnimatedStyle]}>
            <LoopingIcon />
          </Animated.View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
  },
  speedIndicator: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: WIDTH,
    height: 36,
    justifyContent: "center",
    marginVertical: 8,
  },
  fancyBorderContainer: {},
  rightIcon: {
    width: 24,
    paddingLeft: 1,
    alignItems: "flex-start",
    overflow: "visible",
  },
  leftIcon: {
    width: 20,
    paddingRight: 0.8,
    alignItems: "flex-end",
    overflow: "visible",
  },
});
