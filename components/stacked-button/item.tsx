import {
  Pressable,
  PressableProps,
  GestureResponderEvent,
  StyleSheet,
} from "react-native";
import React from "react";
import { useStackedButton } from "./provider";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type ItemProps = {
  index?: number;
  children: React.ReactNode;
  asChild?: boolean;
  disableExpand?: boolean;
  handleConfirmation?: () => void;
  expandedElement?: React.JSX.Element;
} & PressableProps;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Item({
  index = 1,
  children,
  asChild,
  disableExpand,
  handleConfirmation,
  onPress,
  style,
  expandedElement,
  ...pressableProps
}: ItemProps) {
  const {
    currentIndex,
    itemStyles,
    itemProps,
    itemCount,
    containerWidth,
    gap,
    initialIndex = 0,
  } = useStackedButton();

  const expanded = useDerivedValue(() => {
    return currentIndex.value !== 0;
  });

  const isActive = useDerivedValue(() => {
    return currentIndex.value === index;
  });

  const handlePress = (e: GestureResponderEvent) => {
    const isInit = index === initialIndex;
    const isNone = currentIndex.get() === 0;

    if (disableExpand) {
      currentIndex.set(initialIndex);
      console.log(
        "Disabled expand, currentIndex set to initialIndex:",
        initialIndex,
      );
      onPress?.(e);
    } else {
      const alreadyExpanded = currentIndex.get() === index;

      console.log(alreadyExpanded);

      if (alreadyExpanded) {
        currentIndex.set(isInit ? 0 : initialIndex);
        onPress?.(e);
      } else {
        currentIndex.set(isInit && isNone ? initialIndex : isInit ? 0 : index);
        handleConfirmation?.();
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const exp = expanded.value;
    const active = isActive.value || !exp;
    const current = currentIndex.get();

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
      : !exp
        ? 0
        : (index + (current > index ? -1 : 1) - itemCount.value) * width;

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

  const notActive = useDerivedValue(() => {
    return !isActive.get();
  });

  const createAnimatedStyle = (isVisible: SharedValue<boolean>) => {
    if (!expandedElement) return {};
    return useAnimatedStyle(() => {
      return {
        opacity: withSpring(isVisible.value ? 1 : 0),
      };
    });
  };

  const expandedAnimatedStyle = createAnimatedStyle(notActive);
  const mainAnimatedStyle = createAnimatedStyle(isActive);

  const ExpandedChild = () => {
    if (!expandedElement) return null;
    return (
      <Animated.View
        style={[StyleSheet.absoluteFill, combinedStyles, expandedAnimatedStyle]}
      >
        {expandedElement}
      </Animated.View>
    );
  };

  const combinedStyles = [styles.item, itemProps.style, itemStyles, style];

  if (asChild) {
    const childElement = children as React.ReactElement<any>;
    return (
      <Animated.View style={[animatedStyle]}>
        {React.cloneElement(childElement, {
          onPress: handlePress,
          ...itemProps,
          ...pressableProps,
          style: [childElement.props.style],
          children: (
            <>
              <Animated.View style={[combinedStyles, mainAnimatedStyle]}>
                {childElement.props.children}
              </Animated.View>
              <ExpandedChild />
            </>
          ),
        })}
      </Animated.View>
    );
  }

  return (
    <AnimatedPressable
      style={[animatedStyle]}
      onPress={handlePress}
      {...pressableProps}
      {...itemProps}
    >
      <Animated.View style={[combinedStyles, mainAnimatedStyle]}>
        {children}
      </Animated.View>
      <ExpandedChild />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  item: {},
});
