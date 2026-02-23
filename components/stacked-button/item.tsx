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
} & PressableProps;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Item({
  index = 0,
  children,
  wrapper,
  wrapperProps,
  asChild = false,

  ...pressableProps
}: ItemProps) {
  const { currentIndex, itemStyles, itemProps, itemCount, containerWidth } =
    useStackedButton();
  const Wrapper = wrapper || React.Fragment;

  const expanded = useDerivedValue(() => {
    return currentIndex.value > 0;
  });

  const isActive = useDerivedValue(() => {
    return currentIndex.value === index;
  });

  const handlePress = (e: GestureResponderEvent) => {
    currentIndex.value = index;
    pressableProps.onPress?.(e);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const exp = !expanded.get();
    const active = isActive.value || exp;
    return {
      opacity: withSpring(active ? 1 : 0),
      transform: [
        {
          translateX: withSpring(
            active
              ? 0
              : (index - itemCount.value) *
                  (containerWidth.value / itemCount.value),
          ),
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
      <AnimatedPressable
        style={[styles.item, itemStyles, animatedStyle]}
        {...itemProps}
        {...pressableProps}
        onPress={handlePress}
      >
        {children}
      </AnimatedPressable>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  item: {},
});
