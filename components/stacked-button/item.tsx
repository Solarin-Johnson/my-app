import {
  Pressable,
  PressableProps,
  GestureResponderEvent,
  StyleSheet,
} from "react-native";
import React from "react";
import { useStackedButton } from "./provider";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

export type ItemProps = {
  index?: number;
  children: React.ReactNode;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  wrapperProps?: any;
  asChild?: boolean;
  disableExpand?: boolean;
  handleConfirmation?: () => void;
} & PressableProps;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Item({
  index = 1,
  children,
  wrapper,
  wrapperProps,
  asChild,
  disableExpand,
  handleConfirmation,
  ...pressableProps
}: ItemProps) {
  const {
    currentIndex,
    itemStyles,
    itemProps,
    itemCount,
    containerWidth,
    gap,
  } = useStackedButton();
  const Wrapper = wrapper || React.Fragment;

  const expanded = useDerivedValue(() => {
    return currentIndex.value > 0;
  });

  const isActive = useDerivedValue(() => {
    return currentIndex.value === index;
  });

  const handlePress = (e: GestureResponderEvent) => {
    if (disableExpand) {
      pressableProps.onPress?.(e);
    } else {
      const alreadyExpanded = currentIndex.value === index;

      if (!alreadyExpanded) {
        currentIndex.value = index;
        handleConfirmation?.();
      } else {
        pressableProps.onPress?.(e);
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const exp = expanded.value;
    const active = isActive.value || !exp;

    const gapTotal = gap * (itemCount.value - 1);
    const itemGap = gap * (index - 1);

    const width =
      (containerWidth.value - gapTotal) / Math.max(itemCount.value, 1);
    const fullWidth = containerWidth.value;

    if (fullWidth === 0 || itemCount.value === 0) {
      return {};
    }

    const translateX = isActive.get()
      ? -(index - 1) * width - itemGap
      : active
        ? 0
        : (index - itemCount.value) * width;

    return {
      opacity: withSpring(active ? 1 : 0),
      width: withSpring(isActive.value ? fullWidth : width),
      transform: [
        {
          translateX: withSpring(translateX),
        },
      ],
    };
  });

  if (asChild) {
    const childElement = children as React.ReactElement<any>;
    return (
      <Wrapper {...wrapperProps}>
        <Animated.View style={animatedStyle}>
          {React.cloneElement(childElement, {
            onPress: handlePress,
            style: [styles.item, itemStyles, childElement.props.style],
            ...itemProps,
            ...pressableProps,
          })}
        </Animated.View>
      </Wrapper>
    );
  }

  return (
    <Wrapper {...wrapperProps}>
      <Animated.View style={[animatedStyle, {}]}>
        <AnimatedPressable
          style={[styles.item, itemStyles]}
          {...itemProps}
          {...pressableProps}
          onPress={handlePress}
        >
          {children}
        </AnimatedPressable>
      </Animated.View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  item: {},
});
