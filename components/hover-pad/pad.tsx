import { View, Text, ViewProps, StyleSheet } from "react-native";
import React from "react";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import { useHoverPad } from "./provider";
import { UpdatePositionType } from "./types";
import { scheduleOnRN } from "react-native-worklets";
import { useDerivedValue } from "react-native-reanimated";

export default function Pad({ style = styles.default, ...props }: ViewProps) {
  const { state, position, resetPosition } = useHoverPad();

  const updatePosition = (e: UpdatePositionType) => {
    "worklet";
    state.set("pan");
    position.set({
      x: e.absoluteX,
      y: e.absoluteY,
    });
  };

  const panGesture = usePanGesture({
    onBegin: (e) => {
      updatePosition(e);
      state.set("holding");
    },
    onFinalize: () => {
      if (state.value === "holding") {
        state.set("touch");
      }
    },
    onUpdate: (e) => {
      updatePosition(e);
    },
    onDeactivate: () => {
      state.set("idle");
      resetPosition();
    },
    minDistance: 0,
  });

  useDerivedValue(() => {
    console.log(state.value, position.value);
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View {...props} style={style}>
        <Text>Pad</Text>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  default: {
    width: 100,
    height: 100,
    backgroundColor: "red",
  },
});
