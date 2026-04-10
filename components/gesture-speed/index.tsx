import { View, StyleSheet, useWindowDimensions } from "react-native";
import React from "react";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import LoopingIcon from "./looping-icon";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Feedback } from "@/functions";
import { UIAnimatedText } from "../ui/ui-animated-text";
import FancyStrokeButton from "../ui/fancy-stroke-button";
import { runOnJS } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Lock } from "lucide-react-native";
import FancyText from "../FancyText";

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
  const translateX = useSharedValue(-THRESHOLD);
  const translateY = useSharedValue(0);
  const isVisible = useSharedValue(false);
  const locked = useSharedValue(false);
  const dragging = useSharedValue(false);

  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const MARGIN = top + bottom;
  const MAX_HEIGHT = height - MARGIN - 100;

  const speed = useDerivedValue(() => {
    return interpolate(
      translateX.value,
      [-THRESHOLD, 0, THRESHOLD],
      [1, 2, 3],
      Extrapolation.CLAMP,
    ).toFixed(1);
  });

  const lockProgress = useDerivedValue(() => {
    if (speed && speed.value === "1.0") {
      return 0;
    }
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
    },
    onDeactivate: () => {
      dragging.value = false;
      translateY.value = applySpring(0);
      if (lockProgress.value !== 1) {
        isVisible.value = false;
        translateX.value = -THRESHOLD;
      }
      if (lockProgress.value === 1) {
        locked.value = true;
      }
    },
    activateAfterLongPress: 300,
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
        <Animated.View style={[styles.wrapper, indicatorAnimatedStyle]}>
          <View style={styles.speedIndicator}>
            <View style={StyleSheet.absoluteFill}>
              <ThemedTextWrapper
                attribute="strokeColor"
                colorName="gestureBtnBg"
              >
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
          </View>
          <Helper
            speed={speed}
            dragging={dragging}
            lockProgress={lockProgress}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const HELPER_WORDS = [
  "Swipe sideways to adjust speed.",
  "Swipe down to lock speed.",
];

type HelperProps = {
  speed: SharedValue<string>;
  dragging: SharedValue<boolean>;
  lockProgress: SharedValue<number>;
};

const Helper = ({ speed, dragging, lockProgress }: HelperProps) => {
  const isIdle = useSharedValue(1);
  const speedChanged = useSharedValue(false);

  const currentWordIndex = useDerivedValue(() => {
    console.log(speedChanged.value);

    if (dragging.value === false) {
      return 2;
    }
    if (lockProgress.value > 0.1 || speedChanged.value) {
      return 1;
    }

    return 0;
  });

  useAnimatedReaction(
    () => currentWordIndex.value,
    (val, prev) => {
      isIdle.value = 0;
      if (val !== prev) {
        isIdle.value = withDelay(2000, withTiming(1, { duration: 0 }));
      }
    },
  );

  useAnimatedReaction(
    () => speed.value,
    (val, prev) => {
      console.log("prev", prev);

      if (val !== prev && prev !== "1.0") {
        speedChanged.value = true;
      } else {
        speedChanged.value = false;
      }
    },
  );

  const xAnimatedStyle = useAnimatedStyle(() => {
    const active =
      currentWordIndex.value === 0 && dragging.value && !!!isIdle.value;
    return {
      opacity: withTiming(active ? 1 : 0, {
        duration: 200,
      }),
    };
  });

  const yAnimatedStyle = useAnimatedStyle(() => {
    const active =
      currentWordIndex.value === 1 && dragging.value && !!!isIdle.value;
    return {
      opacity: withTiming(active ? 1 : 0, {
        duration: 200,
      }),
    };
  });
  return (
    <View style={styles.helperContainer}>
      <ThemedTextWrapper style={styles.helperText}>
        <Animated.Text style={xAnimatedStyle}>{HELPER_WORDS[0]}</Animated.Text>
      </ThemedTextWrapper>
      <ThemedTextWrapper style={styles.helperText}>
        <Animated.Text style={yAnimatedStyle}>{HELPER_WORDS[1]}</Animated.Text>
      </ThemedTextWrapper>
    </View>
  );
};

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
  wrapper: {
    width: "100%",
    justifyContent: "center",
  },
  helperContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginVertical: 15,
  },
  helperText: {
    fontSize: 14,
    position: "absolute",
  },
});
