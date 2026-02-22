import React, { useRef } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
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
import { ThemedText } from "../ThemedText";

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
      opacity: withSpring(isDragging.get() && !snapped.get() ? 1 : 0),
    };
  });

  const startRecording = () => {
    recordRef.current?.start();
  };

  const stopRecording = () => {
    recordRef.current?.stop();
  };

  useAnimatedReaction(
    () => strokeProgress.value,
    (value, prev) => {
      if (value === 1 && prev && value !== prev) {
        scheduleOnRN(hapticsFeedback);
      }
    },
  );

  useAnimatedReaction(
    () => snapped.get(),
    (snappedValue, prev) => {
      if (snappedValue && !prev) {
        scheduleOnRN(startRecording);
      } else if (prev) {
        scheduleOnRN(stopRecording);
      }
    },
  );

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(snapped.get() ? 1 : 0),
    };
  });

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
        <SafeAreaView style={style.content}>
          <View style={style.head}>
            <ThemedText style={style.title}>New Recording</ThemedText>
            <ThemedText style={style.subtitle} type="regular">
              untitled project
            </ThemedText>
          </View>
          <Record ref={recordRef} />
        </SafeAreaView>
      </Animated.View>
      <Animated.View
        style={[
          style.button,
          { top: islandHeight - BTN_HEIGHT },
          btnAnimatedStyle,
        ]}
      >
        <FancyStrokeButton progress={strokeProgress} />
      </Animated.View>
    </View>
  );
}

const style = StyleSheet.create({
  button: {
    position: "absolute",
    alignSelf: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 32,
  },
  head: {
    paddingTop: 42,
    gap: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 15,
    letterSpacing: -0.2,
    opacity: 0.65,
  },
});
