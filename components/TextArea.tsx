import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from "react-native";
import React, { useEffect } from "react";
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnUI } from "react-native-worklets";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const isWeb = Platform;
const HANDLE_WIDTH = 20;
const HANDLE_HEIGHT = 10;
const MIN_SIZE = 50;

type TextAreaProps = {
  containerStyle?: StyleProp<ViewStyle>;
  maxHeight?: number;
  minHeight?: number;
  maxWidth?: number;
  minWidth?: number;
};

export default function TextArea({
  style,
  containerStyle,
  maxHeight,
  minHeight = MIN_SIZE,
  maxWidth,
  minWidth = MIN_SIZE,
  ...props
}: TextAreaProps & TextInputProps) {
  const textInputRef = useAnimatedRef();
  const cordX = useSharedValue(0);
  const cordY = useSharedValue(0);
  const layout = useSharedValue({ width: 0, height: 0 });

  const chooseMax = (val: number, axis: "x" | "y") => {
    "worklet";
    const key = axis === "x" ? "width" : "height";
    const base = layout.value[key] + val;
    let min = MIN_SIZE;
    let max = Number.POSITIVE_INFINITY;
    if (axis === "x") {
      if (typeof minWidth === "number") min = minWidth;
      if (typeof maxWidth === "number") max = maxWidth;
    } else {
      if (typeof minHeight === "number") min = minHeight;
      if (typeof maxHeight === "number") max = maxHeight;
    }
    return Math.max(min, Math.min(base, max));
  };

  const pan = Gesture.Pan()
    .minDistance(isWeb ? 1 : 0)
    .onUpdate((e) => {
      cordX.value = e.translationX;
      cordY.value = e.translationY;
    })
    .onEnd(() => {
      layout.value = {
        width: chooseMax(cordX.value, "x"),
        height: chooseMax(cordY.value, "y"),
      };
      cordX.value = 0;
      cordY.value = 0;
    });

  const animatedStyle = useAnimatedStyle(() => {
    if (layout.value.width === 0 || layout.value.height === 0) return {};

    return {
      width: layout.value.width + cordX.value,
      height: layout.value.height + cordY.value,
    };
  });

  useEffect(() => {
    scheduleOnUI(() => {
      const measurement = measure(textInputRef);
      if (!measurement) return;
      layout.value = {
        width: measurement.width,
        height: measurement.height,
      };
    });
  }, []);

  const maxStyle = {
    maxHeight: maxHeight,
    minHeight: minHeight,
    maxWidth: maxWidth,
    minWidth: minWidth,
  };

  return (
    <Animated.View
      ref={textInputRef}
      style={[containerStyle, maxStyle, animatedStyle]}
    >
      <TextInput
        placeholder="Type something..."
        multiline
        style={[
          style,
          {
            flex: 1,
            ...maxStyle,
          },
        ]}
        {...props}
      />
      <GestureDetector gesture={pan}>
        <View style={styles.handle} />
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  handle: {
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: 2.5,
    backgroundColor: "red",
    position: "absolute",
    right: 4,
    bottom: 4,
  },
});
