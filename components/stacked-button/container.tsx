import { View, Text, StyleProp, ViewStyle, StyleSheet } from "react-native";
import React, {
  Children,
  cloneElement,
  isValidElement,
  useLayoutEffect,
} from "react";
import Item from "./item";
import Animated, { measure, useAnimatedRef } from "react-native-reanimated";
import { useStackedButton } from "./provider";
import { scheduleOnUI } from "react-native-worklets";

type ContainerProps = {
  children?:
    | React.ReactElement<typeof Item>
    | React.ReactElement<typeof Item>[];
  style?: StyleProp<ViewStyle>;
};

export default function Container({ children, style }: ContainerProps) {
  const animatedRef = useAnimatedRef();

  const { containerWidth, itemCount, gap } = useStackedButton();

  const measureView = () => {
    scheduleOnUI(() => {
      const measurement = measure(animatedRef);
      if (measurement === null) {
        return;
      }
      containerWidth.set(measurement.width);
    });
  };

  useLayoutEffect(() => {
    itemCount.set(Children.count(children));
    measureView();
  }, []);

  const renderedChildren = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child, { index: index + 1 } as any);
    }
    return child;
  });

  return (
    <Animated.View style={[style]}>
      <Animated.View
        ref={animatedRef}
        style={[styles.container, { gap }]}
        onLayout={measureView}
      >
        {renderedChildren}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    // backgroundColor: "red",
  },
});
