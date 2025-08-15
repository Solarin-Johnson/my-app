import { Children, cloneElement, isValidElement, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from "react-native";

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

export default function GestureMenu({
  style,
  children,
  spacing = 4,
  width = 200,
  radius = 16,
  itemHeight = 34,
  itemWidth = 100,
  horizontal = false,
}: GestureMenuProps) {
  const derivedStyle: StyleProp<ViewStyle> = {
    minWidth: width,
    padding: spacing,
    // gap: spacing,
    borderRadius: radius,
    flexDirection: horizontal ? "row" : "column",
  };

  const itemStyle: StyleProp<ViewStyle> = {
    borderRadius: radius - spacing,
    height: itemHeight,
    padding: spacing,
    minWidth: itemWidth,
  };

  const indicatorStyle: StyleProp<ViewStyle> = {
    width: horizontal ? itemWidth : width - spacing * 2,
    height: itemHeight,
    borderRadius: radius - spacing,
    marginTop: spacing,
    marginLeft: spacing,
  };

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

  return (
    <View style={[styles.curve, styles.container, style, derivedStyle]}>
      <Indicator style={indicatorStyle} />
      {processedChildren}
    </View>
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
  return <View style={[styles.curve, styles.indicator, style]} />;
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
