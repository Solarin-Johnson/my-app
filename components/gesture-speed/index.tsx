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
  withSpring,
} from "react-native-reanimated";
import { ThemedTextWrapper } from "../ThemedText";
import Svg, { Line, Path } from "react-native-svg";
import { describeArc } from "@/functions";
import { Host, Text } from "@expo/ui/swift-ui";
import { UIAnimatedText } from "../ui/ui-animated-text";
import FancyStrokeButton from "../ui/fancy-stroke-button";

const AnimatedText = Animated.createAnimatedComponent(Text);

const THRESHOLD = 60;
const LOCK_THRESHOLD = 100;
const WIDTH = 100;

export default function GestureSpeed() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = usePanGesture({
    onUpdate: (e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      console.log(e.translationX);
    },
    onDeactivate: () => {
      translateX.value = 0;
      translateY.value = withSpring(0);
    },
    activateAfterLongPress: 200,
  });

  const speed = useDerivedValue(() => {
    return interpolate(
      translateX.value,
      [-THRESHOLD, 0, THRESHOLD],
      [1, 2, 3],
      Extrapolation.CLAMP,
    ).toFixed(1);
  });

  const lockProgress = useDerivedValue(() => {
    return interpolate(
      translateY.value,
      [0, LOCK_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP,
    );
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        <View style={styles.speedIndicator}>
          <View style={StyleSheet.absoluteFill}>
            <FancyStrokeButton
              progress={lockProgress}
              strokeColor="red"
              text=""
              width={WIDTH / 2}
            />
          </View>
          <UIAnimatedText text={speed} />
          <LoopingIcon />
        </View>
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
