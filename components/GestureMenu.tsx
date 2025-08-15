import { Children, cloneElement } from "react";
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
  itemHeight = 32,
}: GestureMenuProps) {
  const derivedStyle: StyleProp<ViewStyle> = {
    width: width,
    padding: spacing,
    // gap: spacing,
    borderRadius: radius,
  };

  const itemStyle: StyleProp<ViewStyle> = {
    borderRadius: radius - spacing,
    height: itemHeight,
    padding: spacing,
  };

  return (
    <View style={[styles.curve, styles.container, style, derivedStyle]}>
      {Children.map(children, (child) =>
        cloneElement(child, {
          style: { ...itemStyle, ...((child.props.style as ViewStyle) || {}) },
        })
      )}
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

const styles = StyleSheet.create({
  curve: {
    borderCurve: "continuous",
  },
  container: {},
  item: {
    // backgroundColor: "#00000050",
    justifyContent: "center",
  },
});
