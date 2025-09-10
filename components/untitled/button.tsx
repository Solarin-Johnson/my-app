import { View, Pressable, StyleSheet } from "react-native";
import React, { ReactElement } from "react";
import { ThemedTextWrapper } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import PressableBounce from "../PresableBounce";

export default function UntitledButton({
  children,
  onPress,
}: {
  children?: ReactElement<any>;
  onPress?: () => void;
}) {
  const text = useThemeColor("text");
  return (
    <PressableBounce
      style={[styles.button, { backgroundColor: text + "16" }]}
      onPress={onPress}
    >
      {children && <ThemedTextWrapper>{children}</ThemedTextWrapper>}
    </PressableBounce>
  );
}

export const UntitledButtonWrapper = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return <View style={styles.wrapper}>{children}</View>;
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  wrapper: {
    flexDirection: "row",
    gap: 10,
  },
});
