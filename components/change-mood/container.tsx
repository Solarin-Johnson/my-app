import { StyleSheet, View } from "react-native";
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
import {
  GestureDetector,
  usePanGesture,
  useSimultaneousGestures,
  useTapGesture,
} from "react-native-gesture-handler";
import Item, { type Dimensions } from "./item";
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
  const { currentIndex } = useChangeMood();
  const containerWidth = useSharedValue(0);
  const hasTriggered = useSharedValue(false);

  const collapsedWidth =
    collapsedSize?.width ?? size?.width ?? expandedSize?.width ?? 0;

  const expandedWidth =
    expandedSize?.width ?? size?.width ?? collapsedSize?.width ?? 0;

  const validItems = Children.toArray(children).filter(
    (child) => isValidElement(child) && (child as ReactElement).type === Item,
  ) as ReactElement[];

  const numberOfValidItems = validItems.length;

  const otherChildren = Children.toArray(children).filter(
    (child) => !isValidElement(child) || (child as ReactElement).type !== Item,
  );

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

  const panGesture = usePanGesture({
    onActivate: () => {
      hasTriggered.value = false;
    },

    onUpdate: (event) => {
      if (hasTriggered.value || currentIndex.value === 0) return;
      const threshold = 50;
      if (event.translationX > threshold) {
        hasTriggered.value = true;
        currentIndex.set(Math.max(1, currentIndex.value - 1));
      } else if (event.translationX < -threshold) {
        hasTriggered.value = true;
        currentIndex.set(Math.min(numberOfValidItems, currentIndex.value + 1));
      }
    },
  });

  const tapGesture = useTapGesture({
    maxDistance: 0,
    onDeactivate: () => {
      if (currentIndex.value === 0) return;
      currentIndex.set(0);
    },
  });

  const swipeGesture = useSimultaneousGestures(panGesture, tapGesture);

  return (
    <>
      <GestureDetector gesture={swipeGesture}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {otherChildren}
          <Animated.View
            style={[styles.container, { gap }, animatedStyle]}
            onLayout={(event) => {
              const { width } = event.nativeEvent.layout;
              containerWidth.value = width;
            }}
          >
            {validItems.map((child, index) =>
              cloneElement(child as ReactElement<any>, {
                index: index + 1,
                expandedSize,
                size,
                collapsedSize,
              }),
            )}
          </Animated.View>
        </View>
      </GestureDetector>
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
    height: 500,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
