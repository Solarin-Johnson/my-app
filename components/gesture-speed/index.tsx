import { View, StyleSheet } from "react-native";
import React from "react";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import LoopingIcon from "./looping-icon";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedTextWrapper } from "../ThemedText";
import Svg, { Line, Path } from "react-native-svg";
import { describeArc } from "@/functions";
import { Host, Text } from "@expo/ui/swift-ui";

const AnimatedText = Animated.createAnimatedComponent(Text);

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
    return (
      Math.round(
        interpolate(
          translateX.value,
          [-50, 0, 50],
          [1, 2, 3],
          Extrapolation.CLAMP,
        ) * 10,
      ) / 10
    );
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      text: String(speed.value),
    } as any;
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <Host style={{ flex: 1 }}>
          <AnimatedText />
        </Host>

        <LoopingIcon />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
