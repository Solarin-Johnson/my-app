import {
  View,
  Text,
  Switch as RNSwitch,
  SwitchProps,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { ThemedText } from "../ThemedText";

interface CustomSwitchProps extends SwitchProps {
  title?: string;
  textProps?: React.ComponentProps<typeof ThemedText>;
}

export default function Switch({
  title,
  textProps,
  ...switchProps
}: CustomSwitchProps) {

  return (
    <View style={styles.container}>
      <ThemedText {...textProps}>{title}</ThemedText>
      <View>
        <RNSwitch
          {...switchProps}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 12,
  },
});
