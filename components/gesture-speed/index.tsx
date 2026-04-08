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
} from "react-native-reanimated";
import { Feedback } from "@/functions";
import { UIAnimatedText } from "../ui/ui-animated-text";
import FancyStrokeButton from "../ui/fancy-stroke-button";
import { runOnJS } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const THRESHOLD = 64;
const LOCK_THRESHOLD = 80;
const ACTIVATE_LOCK_THRESHOLD = 5;
const WIDTH = 90;
const TRANSLATE_Y_ENTRY = 15;
const MAX_TRANSLATE_Y = 300;

const feedback = () => {
  Feedback.light();
};

const feedbackSoft = () => {
  Feedback.selection();
};

export const SPRING_CONFIG = {
  damping: 30,
  mass: 0.45,
  stiffness: 150,
};

export const SPRING_CONFIG_SNAP = {
  damping: 35,
  mass: 0.25,
  stiffness: 300,
};

const applySpring = (value: number, snap?: boolean) => {
  "worklet";
  return withSpring(value, snap ? SPRING_CONFIG_SNAP : SPRING_CONFIG);
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
      [1, 2, 3],
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

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: indictorTranslateY.value,
        },
        { scale: applySpring(isVisible.value ? 1 : 0.75, true) },
      ],
      opacity: applySpring(isVisible.value ? 1 : 0, true),
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <Animated.View style={[styles.speedIndicator, indicatorAnimatedStyle]}>
          <View style={StyleSheet.absoluteFill}>
            <FancyStrokeButton
              progress={buttonProgress}
              strokeColor="red"
              text=""
              width={WIDTH / 2}
            />
          </View>
          <UIAnimatedText text={speed} />
          <LoopingIcon />
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
    gap: 1,
    width: WIDTH,
    height: 36,
    justifyContent: "center",
  },
  fancyBorderContainer: {},
});
