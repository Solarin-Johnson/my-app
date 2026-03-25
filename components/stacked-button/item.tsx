import {
  Pressable,
  PressableProps,
  GestureResponderEvent,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { useCallback, useLayoutEffect } from "react";
import { useStackedButton } from "./provider";
import Animated, {
  measure,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";

type ItemProps = {
  index?: number;
  children: React.ReactNode;
  asChild?: boolean;
  disableExpand?: boolean;
  handleConfirmation?: () => void;
  expandedElement?: React.JSX.Element;
  childStyle?: StyleProp<ViewStyle>;
  expandedStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
} & PressableProps;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SPRING_CONFIG = {
  damping: 20,
  mass: 0.55,
  stiffness: 250,
  // overshootClamping: false,
};

const applySpring = (value: number) => {
  "worklet";
  return withSpring(value, SPRING_CONFIG);
};

export default function Item({
  index = 1,
  children,
  asChild,
  disableExpand,
  handleConfirmation,
  onPress,
  style,
  childStyle = {},
  expandedStyle = {},
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

  const animatedRef = useAnimatedRef();
  const expandedAnimatedRef = useAnimatedRef();

  const childWidth = useSharedValue(0);
  const expandedWidth = useSharedValue(0);

  const expanded = useDerivedValue(() => {
    return currentIndex.value !== 0;
  });

  const isActive = useDerivedValue(() => {
    return currentIndex.value === index;
  });

  const itemWidth = useDerivedValue(() => {
    const gapTotal = gap * (itemCount.value - 1);
    return (containerWidth.value - gapTotal) / Math.max(itemCount.value, 1);
  });

  const combinedStyles = [style, styles.item, itemProps.style, itemStyles];

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

    const itemGap = gap * (index - 1);

    const width = itemWidth.get();
    const fullWidth = containerWidth.get();

    if (fullWidth === 0 || itemCount.value === 0) {
      return {};
    }

    const translateX = isActive.get()
      ? -(index - 1) * width - itemGap
      : !exp
        ? 0
        : (itemCount.get() - 1 + (current > index ? -1 : 1) - itemCount.value) *
          width;

    return {
      opacity: applySpring(active ? 1 : 0),
      width: applySpring(isActive.value ? fullWidth : width),
      transform: [
        {
          translateX: applySpring(translateX),
        },
      ],
    };
  });

  const notActive = useDerivedValue(() => {
    return !isActive.get();
  });

  const useCreateAnimatedStyle = (isVisible: SharedValue<boolean>) => {
    return useAnimatedStyle(() => {
      if (!expandedElement) return {};

      return {
        opacity: applySpring(isVisible.value ? 1 : 0),
      };
    });
  };

  const expandedAnimatedStyle = useCreateAnimatedStyle(isActive);
  const mainAnimatedStyle = useCreateAnimatedStyle(notActive);

  const innerAnimatedStyle = useAnimatedStyle(() => {
    if (!expandedElement) return {};

    const active = isActive.get();
    const w = containerWidth.get();

    const expLeft = w / 2 - expandedWidth.get() / 2;
    const childLeft = w / 2 - childWidth.get() / 2;

    const translateX = applySpring(active ? expLeft - childLeft : 0);

    return {
      transform: [{ translateX }],
    };
  });

  const expandedInnerAnimatedStyle = useAnimatedStyle(() => {
    if (!expandedElement) return {};

    const active = isActive.get();
    const w = itemWidth.get();

    const expLeft = w / 2 - expandedWidth.get() / 2;
    const childLeft = w / 2 - childWidth.get() / 2;

    const translateX = applySpring(active ? 0 : childLeft - expLeft);

    return {
      transform: [{ translateX }],
    };
  });

  // useDerivedValue(() => {
  //   console.log(
  //     "Child width:",
  //     childWidth.value,
  //     "Expanded width:",
  //     expandedWidth.value,
  //   );
  // });

  const measureMain = useCallback(() => {
    scheduleOnUI(() => {
      if (animatedRef.current === null) return;
      const measurement = measure(animatedRef);
      if (measurement === null) {
        return;
      }
      childWidth.set(measurement.width);
    });
  }, [animatedRef, childWidth]);

  const measureExpanded = useCallback(() => {
    if (!expandedAnimatedRef.current) return;
    scheduleOnUI(() => {
      if (expandedAnimatedRef.current === null) return;
      const measurement = measure(expandedAnimatedRef);
      if (measurement === null) {
        return;
      }
      expandedWidth.set(measurement.width);
    });
  }, [expandedAnimatedRef, expandedWidth]);

  useLayoutEffect(() => {
    measureMain();
    measureExpanded();
  }, [measureMain, measureExpanded]);

  const ExpandedChild = () => {
    if (!expandedElement) return null;

    return (
      <Animated.View
        style={[
          expandedStyle,
          StyleSheet.absoluteFill,
          combinedStyles,
          expandedAnimatedStyle,
        ]}
        onLayout={measureExpanded}
      >
        <Animated.View
          ref={expandedAnimatedRef}
          style={[{}, expandedInnerAnimatedStyle]}
        >
          {expandedElement}
        </Animated.View>
      </Animated.View>
    );
  };

  if (asChild) {
    const childElement = children as React.ReactElement<any>;
    return (
      <Animated.View style={[animatedStyle]}>
        {React.cloneElement(childElement, {
          onPress: handlePress,
          ...itemProps,
          ...pressableProps,
          style: childElement.props.style,
          children: (
            <>
              <Animated.View
                style={[combinedStyles, mainAnimatedStyle]}
                onLayout={measureMain}
              >
                <Animated.View
                  ref={animatedRef}
                  style={[childStyle, innerAnimatedStyle]}
                >
                  {childElement.props.children}
                </Animated.View>
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
      <Animated.View
        style={[combinedStyles, mainAnimatedStyle]}
        onLayout={measureMain}
      >
        <Animated.View ref={animatedRef} style={childStyle}>
          {children}
        </Animated.View>
      </Animated.View>
      <ExpandedChild />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  item: {
    overflow: "hidden",
  },
});
