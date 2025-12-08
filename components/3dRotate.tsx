import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import React, { useImperativeHandle } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Feedback } from "@/functions";

export type Rotate3dHandle = {
  flip: () => void;
  flipTo: (to: "front" | "back") => void;
};

export type Rotate3dProps = {
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
  progress?: SharedValue<number>;
  itemStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  ref?: React.RefObject<Rotate3dHandle | null>;
  perspective?: number;
  rtl?: boolean;
  axis?: "x" | "y"; // <-- Add axis prop
};

const SPRING_CONFIG = {
  damping: 10,
  stiffness: 80,
  mass: 0.6,
};

export default function Rotate3d({
  progress: _progress,
  frontContent,
  backContent,
  itemStyle,
  style,
  ref,
  perspective = 800,
  rtl = true,
  axis = "x",
}: Rotate3dProps) {
  const __progress = useSharedValue(0);
  const progress = _progress ?? __progress;

  const rotation = useDerivedValue(() => {
    return progress.value * 180 * (rtl ? -1 : 1);
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateTransform =
      axis === "y"
        ? { rotateY: `${rotation.value}deg` }
        : { rotateX: `${rotation.value}deg` };
    return {
      transform: [{ perspective }, rotateTransform],
      pointerEvents: Math.abs(rotation.value) > 90 ? "none" : "auto",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateTransform =
      axis === "y"
        ? { rotateY: `${rotation.value + 180}deg` }
        : { rotateX: `${rotation.value + 180}deg` };
    return {
      transform: [{ perspective }, rotateTransform],
      pointerEvents: Math.abs(rotation.value) <= 90 ? "none" : "auto",
    };
  });

  const flipCard = () => {
    progress.value = withSpring(
      Math.round(progress.value) === 0 ? 1 : 0,
      SPRING_CONFIG
    );
    Feedback.soft();
  };

  const flipTo = (to: "front" | "back") => {
    const targetValue = to === "front" ? 0 : 1;
    progress.value = withSpring(targetValue, SPRING_CONFIG);
    Feedback.soft();
  };

  useImperativeHandle(
    ref,
    () => ({
      flip: flipCard,
      flipTo,
    }),
    [flipCard]
  );

  return (
    <View style={style} collapsable={false}>
      <Animated.View
        style={[styles.flipCardItem, itemStyle, frontAnimatedStyle]}
      >
        {frontContent}
      </Animated.View>
      <Animated.View
        style={[styles.flipCardItem, itemStyle, backAnimatedStyle]}
      >
        {backContent}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  flipCard: {},
  flipCardItem: {
    backfaceVisibility: "hidden",
    height: "100%",
    width: "100%",
    position: "absolute",
    // transformOrigin: "bottom center",
  },
  text: {
    fontSize: 24,
  },
});
