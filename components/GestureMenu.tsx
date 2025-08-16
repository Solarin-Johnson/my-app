import { Feedback } from "@/functions";
import { Children, cloneElement, isValidElement, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
  TextStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

type GestureMenuProps = {
  style?: StyleProp<ViewStyle>;
  children:
    | React.ReactElement<GestureMenuItemProps>
    | React.ReactElement<GestureMenuItemProps>[];
  spacing?: number;
  width?: number;
  radius?: number;
  itemHeight?: number;
  itemWidth?: number;
  horizontal?: boolean;
  trail?: boolean;
  indicatorColor?: string;
  itemProps?: Omit<GestureMenuItemProps, "children" | "label">;
  hideSelectionOnBlur: boolean;
};

type GestureMenuItemProps = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
};

const SPRING_CONFIG = {
  stiffness: 200,
  damping: 24,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.0000001,
  restSpeedThreshold: 0.0000001,
};

const applySpring = (value: number) => {
  "worklet";
  return withSpring(value, SPRING_CONFIG);
};

const SnapFeedback = () => {
  Haptics.selectionAsync();
};

export default function GestureMenu({
  style,
  children,
  spacing = 4,
  width: _width = 200,
  radius = 16,
  itemHeight = 34,
  itemWidth = 100,
  horizontal = false,
  trail = true,
  indicatorColor = "orange",
  itemProps,
  hideSelectionOnBlur,
}: GestureMenuProps) {
  const dragging = useSharedValue(false);
  const translate = useSharedValue({
    x: 0,
    y: 0,
  });

  const currentSnapIndex = useSharedValue(-1);

  const itemStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      height: itemHeight,
      padding: spacing,
      minWidth: itemWidth,
    }),
    [spacing, itemHeight, itemWidth]
  );

  const processedChildren = useMemo(() => {
    return Children.map(children, (child) => {
      //   if (!isValidElement(child) || child.type !== GestureMenuItem) {
      //     throw new Error(
      //       "GestureMenu children must be <GestureMenuItem> components only."
      //     );
      //   }

      return cloneElement(child, {
        ...itemProps,
        style: [itemStyle, child.props.style, itemProps?.style],
      });
    });
  }, [children, itemStyle]);

  const width = Math.max(
    _width,
    horizontal ? (processedChildren.length - 1) * itemWidth : 0
  );

  const derivedStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      minWidth: width,
      padding: spacing,
      borderRadius: radius,
      flexDirection: horizontal ? "row" : "column",
    }),
    [width, spacing, radius, horizontal]
  );

  const triggerPress = (index: number) => {
    const targetChild = (Array.isArray(children) ? children : [children])[
      index
    ];
    targetChild?.props.onPress?.();
  };

  const clampValue = (value: number, min: number, max: number) => {
    "worklet";
    return Math.min(Math.max(min, value), max);
  };

  const getHorizontalBounds = (x: number) => {
    "worklet";
    return clampValue(x - itemWidth / 2, 0, width);
  };

  const getVerticalBounds = (y: number) => {
    "worklet";
    return clampValue(
      y - itemHeight / 2,
      0,
      itemHeight * (processedChildren.length - 1)
    );
  };

  const calculateBoundedTranslation = (x: number, y: number) => {
    "worklet";
    return {
      x: horizontal ? getHorizontalBounds(x) : 0,
      y: horizontal ? 0 : getVerticalBounds(y),
    };
  };

  const calculateSnapPosition = (
    x: number,
    y: number,
    animate: boolean = true
  ) => {
    "worklet";
    const roundX = Math.round(x / itemWidth) * itemWidth;
    const roundY = Math.round(y / itemHeight) * itemHeight;

    return {
      x: animate ? applySpring(roundX) : roundX,
      y: animate ? applySpring(roundY) : roundY,
    };
  };

  const calculateSelectedIndex = (x: number, y: number) => {
    "worklet";
    return horizontal
      ? Math.round(getHorizontalBounds(x) / itemWidth)
      : Math.round(getVerticalBounds(y) / itemHeight);
  };

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onBegin(() => {
      dragging.value = true;
    })
    .onUpdate((event) => {
      const bounded = calculateBoundedTranslation(event.x, event.y);
      const newIndex = calculateSelectedIndex(event.x, event.y);

      if (newIndex !== currentSnapIndex.value && dragging.value) {
        currentSnapIndex.value = newIndex;
        runOnJS(SnapFeedback)();
      }

      translate.value = trail
        ? bounded
        : calculateSnapPosition(bounded.x, bounded.y);
    })
    .onEnd(() => {
      if (!trail) return;
      translate.value = calculateSnapPosition(
        translate.value.x,
        translate.value.y
      );
    })
    .onFinalize((event) => {
      dragging.value = false;
      const selectedIndex = calculateSelectedIndex(event.x, event.y);
      runOnJS(triggerPress)(selectedIndex);
    });

  const tapGesture = Gesture.Tap().onBegin((event) => {
    const bounded = calculateBoundedTranslation(event.x, event.y);
    translate.value = calculateSnapPosition(
      bounded.x,
      bounded.y,
      !hideSelectionOnBlur
    );
  });

  const gesture = Gesture.Simultaneous(panGesture, tapGesture);

  const indicatoreAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(dragging.value ? 1 : hideSelectionOnBlur ? 0 : 1, {
        duration: 100,
      }),
      transform: [
        {
          translateX: horizontal ? translate.value.x : 0,
        },
        {
          translateY: horizontal ? 0 : translate.value.y,
        },
      ],
    };
  });

  const indicatorStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      width: horizontal ? itemWidth : width - spacing * 2,
      height: itemHeight,
      borderRadius: radius - spacing,
      marginTop: spacing,
      marginLeft: spacing,
      backgroundColor: indicatorColor,
    }),
    [horizontal, itemWidth, width, spacing, itemHeight, radius, indicatorColor]
  );

  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.curve, styles.container, style, derivedStyle]}>
        <Indicator style={[indicatorStyle, indicatoreAnimatedStyle]} />
        {processedChildren}
      </View>
    </GestureDetector>
  );
}

export const GestureMenuItem = ({
  label,
  style,
  onPress,
  children,
  textStyle,
}: GestureMenuItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.curve, styles.item, style]}
      pointerEvents="none"
    >
      {children || <Text style={textStyle}>{label}</Text>}
    </Pressable>
  );
};

export const Indicator = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  return <Animated.View style={[styles.curve, styles.indicator, style]} />;
};

const styles = StyleSheet.create({
  curve: {
    borderCurve: "continuous",
  },
  container: {},
  item: {
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
  },
});
