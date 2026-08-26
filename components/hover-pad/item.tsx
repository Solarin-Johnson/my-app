import { StyleSheet } from "react-native";
import React, { cloneElement, ReactElement, useEffect } from "react";
import Animated, {
  measure,
  useAnimatedReaction,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { BoundsType, ItemChildType, ItemType } from "./types";
import { runOnUI, scheduleOnRN } from "react-native-worklets";
import { useHoverPad } from "./provider";

export default function Item({
  children,
  index = 0,
  onPress,
  ...props
}: ItemType) {
  const animatedRef = useAnimatedRef();
  const { position, hoveredIndex, state, resetPosition } = useHoverPad();
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
  }, [animatedRef]);

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

  return (
    <Animated.View {...props} ref={animatedRef}>
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

const styles = StyleSheet.create({});
