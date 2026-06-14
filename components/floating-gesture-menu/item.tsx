import { View, Text, ViewProps, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  measure,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { runOnUI, scheduleOnRN } from "react-native-worklets";
import { useFloatingMenu } from "./provider";

type ItemType = {
  removeDefaultStyle?: boolean;
  onPress?: () => void;
  index?: number;
} & ViewProps;

type BoundsType = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function Item({
  children,
  style,
  removeDefaultStyle,
  index = 0,
  onPress,
}: ItemType) {
  const animatedRef = useAnimatedRef();
  const { position, isOpened, hoveredItem, state, resetPosition, close } =
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
    },
  );

  useAnimatedReaction(
    () => isActive.value,
    (active) => {
      if (active) {
        hoveredItem.set(index);
      } else if (hoveredItem.get() === index) {
        hoveredItem.set(null);
      }
    },
  );

  return (
    <Animated.View
      ref={animatedRef}
      style={[!removeDefaultStyle && styles.item, style]}
      //   onLayout={measureItem}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 8,
  },
});
