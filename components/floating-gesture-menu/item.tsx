import { View, Text, ViewProps, StyleSheet } from "react-native";
import React, { cloneElement, ReactElement, useEffect } from "react";
import Animated, {
  measure,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { runOnUI, scheduleOnRN } from "react-native-worklets";
import { useFloatingMenu } from "./provider";
import { SharedValue } from "react-native-gesture-handler/lib/typescript/v3/types";

type ItemType = ViewProps & {
  removeDefaultStyle?: boolean;
  onPress?: () => void;
  index?: number;
  children?: ReactElement;
};

type BoundsType = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ItemChildType = {
  hovered: SharedValue<boolean>;
  active: SharedValue<boolean>;
  index: number;
};

export default function Item({
  children,
  style,
  removeDefaultStyle,
  index = 0,
  onPress,
}: ItemType) {
  const animatedRef = useAnimatedRef();
  const { position, isOpened, hoveredIndex, state, resetPosition, close } =
    useFloatingMenu();
  const bounds = useSharedValue<BoundsType>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });

  const measureItem = () => {
    runOnUI(() => {
      const m = measure(animatedRef);
      if (m === null) {
        return;
      }
      bounds.set({
        x: m.pageX,
        y: m.pageY,
        width: m.width,
        height: m.height,
      });
    })();
  };

  useEffect(() => {
    measureItem();
  }, [isOpened, animatedRef]);

  const isActive = useDerivedValue(() => {
    const p = position.value;
    const b = bounds.value;
    if (!p || !p.x || !p.y) return false;
    const withinX = p.x >= b.x && p.x <= b.x + b.width;
    const withinY = p.y >= b.y && p.y <= b.y + b.height;

    const active = withinX && withinY;

    // console.log(active, index);

    return active;
  });

  useAnimatedReaction(
    () => ({ active: isActive.value, state: state.value }),
    (curr, prev) => {
      const curr_state = curr.state;
      const prev_state = prev?.state;
      if (
        curr.active &&
        (curr_state === "idle" || curr_state === "touch") &&
        (!prev ||
          !(prev.active && (prev_state === "idle" || prev_state === "touch")))
      ) {
        if (onPress) {
          scheduleOnRN(onPress);
          resetPosition();
          scheduleOnRN(close);
        }
      }

      if (curr.active && curr_state === "pan") {
        hoveredIndex.set(index);
      } else if (hoveredIndex.get() === index) {
        hoveredIndex.set(null);
      }
    },
  );

  const hovered = useDerivedValue(() => {
    return hoveredIndex.get() === index;
  });

  useDerivedValue(() => {
    console.log(state.get());

    console.log(isActive.value, hovered.value);
  });

  return (
    <Animated.View
      ref={animatedRef}
      style={[!removeDefaultStyle && styles.item, style]}
      //   onLayout={measureItem}
    >
      {children
        ? cloneElement(children as ReactElement<ItemChildType>, {
            hovered,
            active: isActive,
            index,
          })
        : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 8,
  },
});
