import { View, Text } from "react-native";
import React, { useState } from "react";
import Animated, { SharedValue } from "react-native-reanimated";
import RecordingVisualization from "../recorder/RecordingVisualization";
import { RecordingState } from "../recorder/types";
import Record from "../recorder/Record";

interface RecordProps {
  dragProgress: SharedValue<number>;
}

export default function RecordPage({ dragProgress }: RecordProps) {
  const [state, setState] = useState<RecordingState>(RecordingState.Idle);

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        paddingBottom: 100,
      }}
    >
      <Text>Record</Text>
      <Record />
    </View>
  );
}
