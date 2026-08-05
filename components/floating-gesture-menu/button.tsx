import {
  DimensionValue,
  Pressable,
  PressableProps,
  StyleSheet,
  ViewProps,
} from "react-native";
import { useFloatingMenu } from "./provider";
import Animated from "react-native-reanimated";

type ButtonContainerType = {
  removeDefaultStyle?: boolean;
  width?: number;
  left?: DimensionValue;
  right?: DimensionValue;
  top?: DimensionValue;
  bottom?: DimensionValue;
  height?: DimensionValue;
} & ViewProps;

type ButtonType = {
  removeDefaultStyle?: boolean;
  width?: number;
} & PressableProps;

export function ButtonContainer({
  children,
  style,
  top,
  bottom,
  right,
  left,
  height,
  ...props
}: ButtonContainerType) {
  const { bottomInset, isOpened } = useFloatingMenu();
  const positionStyle = {
    marginBottom: bottom,
    bottom: bottomInset,
    top,
    left,
    right,
    height,
  };

  const combinedStyle: ButtonContainerType["style"] = [
    positionStyle,
    style,
    styles.buttonContainer,
  ];

  return (
    <Animated.View
      style={[
        combinedStyle,
        {
          opacity: isOpened ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: 300,
        },
      ]}
      pointerEvents={isOpened ? "auto" : "none"}
      {...props}
    >
      {children}
    </Animated.View>
  );
}
export function Button({
  children,
  width,
  removeDefaultStyle,
  style,
  ...props
}: ButtonType) {
  const { bottomInset, open, close, state, isOpened, position, resetPosition } =
    useFloatingMenu();

  const makeCombined = (s: any) => [
    !removeDefaultStyle && styles.defaultStyle,
    s,
  ];

  const combinedStyle: PressableProps["style"] =
    typeof style === "function"
      ? (pressState) => makeCombined(style(pressState))
      : makeCombined(style);

  return (
    <Pressable style={combinedStyle} {...props}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    zIndex: 1000,
    justifyContent: "center",
  },
  defaultStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "grey",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 100,
  },
});
