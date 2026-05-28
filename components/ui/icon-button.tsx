import { FC } from "react";
import { ThemedViewProps, ThemedViewWrapper } from "../ThemedView";
import PressableBounce from "../PresableBounce";
import { ThemedTextProps, ThemedTextWrapper } from "../ThemedText";
import { PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";

type IconButtonProps = {
  children: React.ReactElement;
  style?: StyleProp<ViewStyle>;
  themedViewProps?: Omit<ThemedViewProps, "children" | "style">;
  themeTextProps?: Omit<ThemedTextProps, "children">;
  size?: number;
} & PressableProps;

const IconButton: FC<IconButtonProps> = ({
  children,
  onPress,
  style,
  themedViewProps,
  themeTextProps,
  size = 38,
  ...props
}) => (
  <ThemedViewWrapper
    style={[styles.iconButton, { width: size }, style]}
    colorName="captchaBg"
    {...themedViewProps}
  >
    <PressableBounce onPress={onPress} {...props}>
      <ThemedTextWrapper {...themeTextProps}>{children}</ThemedTextWrapper>
    </PressableBounce>
  </ThemedViewWrapper>
);
IconButton.displayName = "IconButton";
export default IconButton;

const styles = StyleSheet.create({
  iconButton: {
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
  },
});
