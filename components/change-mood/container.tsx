import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Button,
} from "react-native";
import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
} from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { type Dimensions } from "./item";
import { SPRING_CONFIG_BOUNCE, useChangeMood } from "./provider";

type ContainerProps = {
  children?: React.ReactNode;
  gap?: number;
  expandedSize?: Dimensions;
  size?: Dimensions;
  collapsedSize?: Dimensions;
};

const defaultSize = { width: 60, height: 100 };
const defaultExpandedSize = { width: 150, height: 280 };
const defaultCollapsedSize = { width: 42, height: 70 };

export default function Container({
  children,
  gap = 10,
  expandedSize = defaultExpandedSize,
  collapsedSize = defaultCollapsedSize,
  size = defaultSize,
}: ContainerProps) {
  const { currentIndex, goToIndex } = useChangeMood();
  const containerWidth = useSharedValue(0);

  const collapsedWidth =
    collapsedSize?.width ?? size?.width ?? expandedSize?.width ?? 0;

  const expandedWidth =
    expandedSize?.width ?? size?.width ?? collapsedSize?.width ?? 0;

  const animatedStyle = useAnimatedStyle(() => {
    const index = currentIndex.value;

    if (index === 0) {
      return {
        transform: [{ translateX: withSpring(0, SPRING_CONFIG_BOUNCE) }],
      };
    }

    const translateX =
      containerWidth.value / 2 -
      expandedWidth / 2 -
      (index - 1) * (collapsedWidth + gap);

    return {
      transform: [{ translateX: withSpring(translateX, SPRING_CONFIG_BOUNCE) }],
    };
  });

  

  return (
    <>
      <Pressable
        pointerEvents="box-none"
        onPress={() => {
          goToIndex(0);
        }}
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={[styles.container, { gap }, animatedStyle]}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            containerWidth.value = width;
          }}
        >
          {Children.map(children, (child, index) =>
            isValidElement(child)
              ? cloneElement(child as ReactElement<any>, {
                  index: index + 1,
                  expandedSize,
                  size,
                  collapsedSize,
                })
              : child,
          )}
        </Animated.View>
      </Pressable>
      {/* <Button
        title="Previous"
        onPress={() => goToIndex(currentIndex.value - 1)}
      />
      <Button title="Next" onPress={() => goToIndex(currentIndex.value + 1)} /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: "100%",
    // backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 20,
  },
});
