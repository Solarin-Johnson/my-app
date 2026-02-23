import { View, Text, StyleProp, ViewStyle, StyleSheet } from "react-native";
import React, {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
} from "react";
import Item from "./item";
import Animated from "react-native-reanimated";
import { useStackedButton } from "./provider";

type ContainerProps = {
  children?:
    | React.ReactElement<typeof Item>
    | React.ReactElement<typeof Item>[];
  style?: StyleProp<ViewStyle>;
};

export default function Container({ children, style }: ContainerProps) {
  const { containerWidth, itemCount } = useStackedButton();

  useEffect(() => {
    itemCount.set(React.Children.count(children));
  }, []);

  return (
    <Animated.View
      style={[styles.container, style]}
      //   onLayout={(e) => {
      //     containerWidth.set(e.nativeEvent.layout.width);
      //   }}
    >
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child, { index: index + 1 } as any);
        }
        return child;
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
