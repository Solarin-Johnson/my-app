import {
  View,
  Text,
  StyleSheet,
  ViewProps,
  Pressable,
  PressableProps,
  Alert,
} from "react-native";
import React, { Fragment, JSX, ReactElement } from "react";
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
  width?: number;
} & PressableProps;

type UpdatePositionType = {
  absoluteX: number;
  absoluteY: number;
};

export default function Trigger({
  children,
  style,
  removeDefaultStyle,
  inset = 25,
  width = 60,
  ...props
}: TriggerType) {
  const { bottomInset, open, close, state, isOpened, position, resetPosition } =
    useFloatingMenu();

  const updatePosition = (e: UpdatePositionType) => {
    "worklet";
    state.set("pan");
    position.set({
      x: e.absoluteX,
      y: e.absoluteY,
    });
  };

  const panGestureTrigger = usePanGesture({
    activateAfterLongPress: 600,
    onActivate: () => {
      scheduleOnRN(open);
    },
    onUpdate: (e) => {
      updatePosition(e);
    },
    onDeactivate: () => {
      state.set("idle");
      //   resetPosition();
    },
  });

  const panGesture = usePanGesture({
    onBegin: (e) => {
      updatePosition(e);
      state.set("holding");
    },
    onFinalize: (e) => {
      state.set("touch");
    },
    onUpdate: (e) => {
      updatePosition(e);
    },
    onDeactivate: () => {
      state.set("idle");
      //   resetPosition();
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

  const gesture = useSimultaneousGestures(singleTap, panGesture);

  const positionStyle = {
    margin: inset,
    marginBottom: 0,
    bottom: bottomInset,
    width,
  };

  const makeCombined = (s: any) => [
    !removeDefaultStyle && styles.defaultStyle,
    s,
    positionStyle,
    styles.trigger,
  ];

  const combinedStyle: PressableProps["style"] =
    typeof style === "function"
      ? (pressState) => makeCombined(style(pressState))
      : makeCombined(style);

  return (
    <>
      <Pressable style={combinedStyle} {...props}>
        <GestureDetector gesture={panGestureTrigger}>
          {children}
        </GestureDetector>
      </Pressable>
      {isOpened && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 100 }]}>
          <GestureDetector gesture={gesture}>
            <View style={[StyleSheet.absoluteFill]} />
          </GestureDetector>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    position: "absolute",
    zIndex: 10,
  },
  defaultStyle: {
    borderRadius: "50%",
    right: 0,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
