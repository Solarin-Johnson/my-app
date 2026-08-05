import { View, Text, ViewProps, StyleSheet } from "react-native";
import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  useEffect,
} from "react";
import { EaseView } from "react-native-ease";
import { useFloatingMenu } from "./provider";
import Item from "./item";
import Animated from "react-native-reanimated";

type ContainerType = {
  bottomInset?: number;
  removeDefaultStyle?: boolean;
  inset?: number;
} & ViewProps;

export default function Container({
  children,
  style,
  bottomInset = 80,
  removeDefaultStyle,
  inset = 25,
  ...props
}: ContainerType) {
  const {
    isOpened,
    bottomInset: menuBottomInset,
    setTotalItems,
  } = useFloatingMenu();
  const bottom = menuBottomInset + bottomInset;

  useEffect(() => {
    const total = Children.toArray(children).filter((child) => {
      return isValidElement(child) && (child.type as any).name === "Item";
    }).length;

    setTotalItems(total);
  }, [children, setTotalItems]);

  return (
    <Animated.View
      style={[
        !removeDefaultStyle && styles.defaultStyle,
        { marginBottom: 0, margin: inset },
        style,
        styles.container,
        {
          bottom,
          opacity: isOpened ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: 100,
        },
      ]}
      {...props}
      pointerEvents={isOpened ? "auto" : "none"}
    >
      {Children.map(children, (child, index) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<any>, { index })
          : child,
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  defaultStyle: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});
