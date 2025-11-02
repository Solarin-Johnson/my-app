import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from "react-native";
import React, { useEffect, useRef } from "react";
import Animated, {
  Easing,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  WithTimingConfig,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnUI } from "react-native-worklets";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const isWeb = Platform;
const HANDLE_WIDTH = 20;
const HANDLE_HEIGHT = 10;
const MIN_SIZE = 40;
const LINE_HEIGHT_DEFAULT = 18;
const PADDING_DEFAULT = 8;

type TextAreaProps = {
  containerStyle?: StyleProp<ViewStyle>;
  maxHeight?: number;
  minHeight?: number;
  maxWidth?: number;
  minWidth?: number;
  autoAdjustHeight?: boolean;
  lineHeight?: number;
  padding?: number;
  borderWidth?: number;
  timingConfig?: WithTimingConfig;
};

const TIMING_CONFIG: WithTimingConfig = {
  duration: 100,
  easing: Easing.inOut(Easing.ease),
};

export default function TextArea({
  style,
  containerStyle,
  maxHeight,
  minHeight = MIN_SIZE,
  maxWidth,
  minWidth = MIN_SIZE,
  autoAdjustHeight = true,
  lineHeight = LINE_HEIGHT_DEFAULT,
  padding = PADDING_DEFAULT,
  borderWidth = 0,
  value,
  onChangeText,
  timingConfig = TIMING_CONFIG,
  ...props
}: TextAreaProps & TextInputProps) {
  const textContainerRef = useAnimatedRef();
  const cordX = useSharedValue(0);
  const cordY = useSharedValue(0);
  const layout = useSharedValue({ width: 0, height: 0 });
  const textInputRef = useRef<TextInput>(null);

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

  const applyConfig = (value: number) => {
    "worklet";
    return autoAdjustHeight ? withTiming(value, timingConfig) : value;
  };

  const resizePan = Gesture.Pan()
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
      height: applyConfig(layout.value.height + cordY.value),
    };
  });

  const handleAutoAdjustHeight = (text: string) => {
    "worklet";
    if (!autoAdjustHeight) return;
    const lines = text.split("\n").length;

    const newHeight = Math.max(
      lines * lineHeight + padding * 2 + borderWidth * 2,
      minHeight
    );
    layout.value = {
      ...layout.value,
      height: newHeight,
    };
  };

  useEffect(() => {
    scheduleOnUI(() => {
      const measurement = measure(textContainerRef);
      if (!measurement) return;
      layout.value = {
        width: measurement.width,
        height: measurement.height,
      };
      handleAutoAdjustHeight(value || "");
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
      style={[containerStyle, maxStyle, animatedStyle]}
      ref={textContainerRef}
    >
      <TextInput
        ref={textInputRef}
        placeholder="Type something..."
        multiline
        style={[
          style,
          {
            ...maxStyle,
            flex: 1,
            lineHeight,
            padding,
            margin: 0,
            borderWidth,
          },
        ]}
        onChangeText={(text) => {
          scheduleOnUI(() => {
            handleAutoAdjustHeight(text);
          });
          onChangeText?.(text);
        }}
        {...props}
      />
      {!autoAdjustHeight && (
        <GestureDetector gesture={resizePan}>
          <View style={styles.handle} />
        </GestureDetector>
      )}
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
    cursor: "se-resize" as any,
  },
});
