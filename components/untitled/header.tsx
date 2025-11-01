import { View, Text, StyleProp, ViewStyle } from "react-native";
import React from "react";
export interface UntitledHeaderProps {
  title?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export default function UntitledHeader({
  title,
  style,
  contentStyle,
  children,
}: UntitledHeaderProps) {
  return (
    <View>
      <Text>eader</Text>
    </View>
  );
}
