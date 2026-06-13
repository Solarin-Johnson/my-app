import { View, Text, ViewProps, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  measure,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { runOnUI } from "react-native-worklets";
import { useFloatingMenu } from "./provider";

type ItemType = {
  removeDefaultStyle?: boolean;
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
}: ItemType) {
  const animatedRef = useAnimatedRef();
  const { position } = useFloatingMenu();
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
    if (!p) return false;
    const withinX = p.x >= b.x && p.x <= b.x + b.width;
    const withinY = p.y >= b.y && p.y <= b.y + b.height;

    console.log(withinX, withinY);

    return withinX && withinY;
  });
  return (
    <Animated.View
      ref={animatedRef}
      style={[!removeDefaultStyle && styles.item, style]}
      onLayout={measureItem}
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
