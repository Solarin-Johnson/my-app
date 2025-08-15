import { Children, cloneElement, isValidElement, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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
};

type GestureMenuItemProps = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const SPRING_CONFIG = {
  stiffness: 200,
  damping: 24,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.000001,
  restSpeedThreshold: 0.000001,
};

const applySpring = (value: number) => {
  "worklet";
  return withSpring(value, SPRING_CONFIG);
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
}: GestureMenuProps) {
  const dragging = useSharedValue(false);
  const translate = useSharedValue({
    x: 0,
    y: 0,
  });

  const itemStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      borderRadius: radius - spacing,
      height: itemHeight,
      padding: spacing,
      minWidth: itemWidth,
    }),
    [radius, spacing, itemHeight, itemWidth]
  );

  const processedChildren = useMemo(() => {
    return Children.map(children, (child) => {
      //   if (!isValidElement(child) || child.type !== GestureMenuItem) {
      //     throw new Error(
      //       "GestureMenu children must be <GestureMenuItem> components only."
      //     );
      //   }

      return cloneElement(child, {
        style: [itemStyle, child.props.style],
      });
    });
  }, [children, itemStyle]);

  const width = Math.max(_width, (processedChildren.length - 1) * itemWidth);

  const derivedStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      minWidth: width,
      padding: spacing,
      borderRadius: radius,
      flexDirection: horizontal ? "row" : "column",
    }),
    [width, spacing, radius, horizontal]
  );

  const pressChild = (index: number) => {
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

  const calculateSnapPosition = (x: number, y: number) => {
    "worklet";
    return {
      x: applySpring(Math.round(x / itemWidth) * itemWidth),
      y: applySpring(Math.round(y / itemHeight) * itemHeight),
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
      translate.value = calculateBoundedTranslation(event.x, event.y);
    })
    .onEnd(() => {
      translate.value = calculateSnapPosition(
        translate.value.x,
        translate.value.y
      );
    })
    .onFinalize((event) => {
      dragging.value = false;
      const selectedIndex = calculateSelectedIndex(event.x, event.y);
      runOnJS(pressChild)(selectedIndex);
    });

  const indicatoreAnimatedStyle = useAnimatedStyle(() => {
    // console.log("translate.value", translate.value);

    return {
      //   opacity: dragging.value ? 1 : 0,
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
    }),
    [horizontal, itemWidth, width, spacing, itemHeight, radius]
  );

  return (
    <GestureDetector gesture={panGesture}>
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
}: GestureMenuItemProps) => {
  return (
    <Pressable onPress={onPress} style={[styles.curve, styles.item, style]}>
      {children || <Text>{label}</Text>}
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
    // backgroundColor: "#00000050",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    backgroundColor: "red",
  },
});
