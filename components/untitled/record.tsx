import React, { useRef } from "react";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Record, { RecordHandle } from "../recorder/Record";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FancyStrokeButton from "../ui/fancy-stroke-button";
import { StyleSheet, View } from "react-native";
import { scheduleOnRN } from "react-native-worklets";
import { Feedback } from "@/functions";
import { SPRING_CONFIG } from "@/constants";

interface RecordProps {
  //   dragProgress: SharedValue<number>;
  maxTranslateY: number;
  translateY: SharedValue<number>;
  treshold: number;
  isDragging: SharedValue<boolean>;
  snapped: SharedValue<boolean>;
}

const hapticsFeedback = () => {
  Feedback.selection();
};

const BTN_HEIGHT = 38;
const PULSE_SPRING_CONFIG = {
  damping: 14,
  stiffness: 220,
  mass: 0.8,
  overshootClamping: false,
  restDisplacementThreshold: 0.0001,
  restSpeedThreshold: 0.0001,
};

export default function RecordPage({
  maxTranslateY,
  translateY,
  treshold,
  isDragging,
  snapped,
}: RecordProps) {
  const recordRef = useRef<RecordHandle>(null);
  const { top } = useSafeAreaInsets();
  const islandHeight = top - 12;

  const topSpace = islandHeight + BTN_HEIGHT;

  const progress = useDerivedValue(() => {
    return interpolate(
      translateY.get(),
      [0, topSpace, maxTranslateY],
      [0, 0, 1],
      Extrapolation.CLAMP,
    );
  });

  const strokeProgress = useDerivedValue(() => {
    return interpolate(
      translateY.get(),
      [0, topSpace, treshold],
      [0, 0, 1],
      Extrapolation.CLAMP,
    );
  });

  const hitThreshold = useDerivedValue(() => {
    return translateY.get() >= treshold;
  });

  const btnAnimatedStyle = useAnimatedStyle(() => {
    const hit = hitThreshold.get();
    const max = maxTranslateY - topSpace * 2;

    const translateY =
      snapped.get() && !isDragging.get()
        ? withSpring(maxTranslateY - topSpace)
        : interpolate(progress.value, [0, 1], [0, max], Extrapolation.CLAMP);

    const scale = withSpring(
      hit ? 1.2 : 1,
      hit ? PULSE_SPRING_CONFIG : SPRING_CONFIG,
    );
    return {
      transform: [{ translateY }, { scale }],
      opacity: withSpring(snapped.get() ? 0 : isDragging.get() ? 1 : 0),
    };
  });

  useAnimatedReaction(
    () => strokeProgress.value,
    (value, prev) => {
      if (value === 1 && prev && value !== prev) {
        scheduleOnRN(hapticsFeedback);
      } else {
      }
    },
  );

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
      }}
    >
      <Record ref={recordRef} />
      <Animated.View
        style={[
          style.button,
          { top: islandHeight - BTN_HEIGHT },
          btnAnimatedStyle,
        ]}
      >
        <FancyStrokeButton progress={strokeProgress} />
      </Animated.View>
      {/* <View
        style={{
          position: "absolute",
          backgroundColor: "red",
          top: 0,
          left: 0,
          right: 0,
          height: top - 12,
        }}
      /> */}
    </View>
  );
}

const style = StyleSheet.create({
  button: {
    position: "absolute",
    alignSelf: "center",
  },
});
