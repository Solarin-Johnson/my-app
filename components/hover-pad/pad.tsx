import { View, Text, ViewProps, StyleSheet } from "react-native";
import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
} from "react";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import { ItemChildType, UpdatePositionType } from "./types";
import { scheduleOnRN } from "react-native-worklets";
import { useDerivedValue } from "react-native-reanimated";
import { useHoverPad } from "./provider";

export default function Pad({
  children,
  style = styles.default,
  ...props
}: ViewProps) {
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

  //   useDerivedValue(() => {
  //     console.log(state.value, position.value);
  //   });

  return (
    <GestureDetector gesture={panGesture}>
      <View {...props} style={style}>
        {Children.map(children, (child, index) =>
          isValidElement(child)
            ? cloneElement(child as ReactElement<ItemChildType>, { index })
            : child,
        )}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
    // backgroundColor: "red",
  },
});
