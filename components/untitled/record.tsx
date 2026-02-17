import { View, Text } from "react-native";
import React from "react";
import Animated, { SharedValue } from "react-native-reanimated";

interface RecordProps {
  dragProgress: SharedValue<number>;
}

export default function Record({ dragProgress }: RecordProps) {
  return (
    <View>
      <Text>Record</Text>
    </View>
  );
}
