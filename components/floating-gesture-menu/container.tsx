import { View, Text, ViewProps, StyleSheet } from "react-native";
import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
} from "react";
import { EaseView } from "react-native-ease";
import { useFloatingMenu } from "./provider";

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
  const { isOpened, bottomInset: menuBottomInset } = useFloatingMenu();
  const bottom = menuBottomInset + bottomInset;
  return (
    <EaseView
      style={[
        !removeDefaultStyle && styles.defaultStyle,
        style,
        styles.container,
        { bottom, marginBottom: 0, margin: inset },
      ]}
      animate={{ opacity: isOpened ? 1 : 0 }}
      transition={{ type: "timing", duration: 0 }}
      {...props}
      pointerEvents={isOpened ? "auto" : "none"}
    >
      {Children.map(children, (child, index) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<any>, { index })
          : child,
      )}
    </EaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
  },
  defaultStyle: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});
