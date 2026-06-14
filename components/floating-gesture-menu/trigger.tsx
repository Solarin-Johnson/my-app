import { View, Text, StyleSheet, ViewProps, Pressable } from "react-native";
import React from "react";
import { zIndex } from "@expo/ui/swift-ui/modifiers";
import { useFloatingMenu } from "./provider";
import {
  GestureDetector,
  GestureEvent,
  usePanGesture,
  useSimultaneousGestures,
  useTapGesture,
} from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

type TriggerType = {
  children: React.ReactNode;
  removeDefaultStyle?: boolean;
  inset?: number;
} & ViewProps;

type UpdatePositionType = {
  absoluteX: number;
  absoluteY: number;
};

export default function Trigger({
  children,
  style,
  removeDefaultStyle,
  inset = 25,
  ...props
}: TriggerType) {
  const { bottomInset, open, close, state, isOpened, position, resetPosition } =
    useFloatingMenu();

  const updatePosition = (e: UpdatePositionType) => {
    "worklet";
    position.set({
      x: e.absoluteX,
      y: e.absoluteY,
    });
  };

  const panGestureTrigger = usePanGesture({
    activateAfterLongPress: 700,
    onActivate: () => {
      state.set("pan");
      scheduleOnRN(open);
    },
    onUpdate: (e) => {
      updatePosition(e);
    },
    onDeactivate: () => {
      state.set("idle");
      resetPosition();
    },
  });

  const panGesture = usePanGesture({
    onActivate: () => {
      scheduleOnRN(open);
    },
    onBegin: (e) => {
      updatePosition(e);
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

  const singleTap = useTapGesture({
    maxDistance: 0,
    maxDuration: 700,
    onActivate: () => {
      if (isOpened) {
        scheduleOnRN(close);
      }
    },
  });

  const gesture = useSimultaneousGestures(singleTap, panGestureTrigger);

  return (
    <>
      {isOpened && (
        <GestureDetector gesture={panGesture}>
          <View style={StyleSheet.absoluteFill} />
        </GestureDetector>
      )}
      <GestureDetector gesture={gesture}>
        <View
          style={[
            !removeDefaultStyle && styles.defaultStyle,
            style,
            { margin: inset, marginBottom: 0, bottom: bottomInset },
            styles.trigger,
          ]}
          {...props}
        >
          {children}
        </View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    position: "absolute",
    zIndex: 100,
  },
  defaultStyle: {
    borderRadius: "50%",
    right: 0,
    backgroundColor: "#88888888",
    width: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
