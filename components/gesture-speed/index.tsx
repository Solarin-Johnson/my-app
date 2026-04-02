import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import LoopingIcon from "./looping-icon";
import {
  Extrapolation,
  interpolate,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { AnimatedText } from "../ui/animated-text";
import { ThemedTextWrapper } from "../ThemedText";

export default function GestureSpeed() {
  const translateX = useSharedValue(0);
  const panGesture = usePanGesture({
    onUpdate: (e) => {
      translateX.value = e.translationX;
      console.log(e.translationX);
    },
    onDeactivate: () => {
      translateX.value = 0;
    },
    activateAfterLongPress: 200,
  });

  const speed = useDerivedValue(() => {
    return interpolate(
      translateX.value,
      [-50, 0, 50],
      [1, 2, 3],
      Extrapolation.CLAMP,
    );
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <ThemedTextWrapper>
          <AnimatedText text={speed} style={{ fontSize: 18 }} />
        </ThemedTextWrapper>
        <LoopingIcon speed={speed} />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
});
