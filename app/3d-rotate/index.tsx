import React from "react";
import { useSharedValue } from "react-native-reanimated";
import Index from "./default";
import Slider from "@/components/Slider";
import { View } from "react-native";

export default function IosIndex() {
  const progress = useSharedValue(0);

  return (
    <Index progress={progress}>
      <View
        style={{
          alignSelf: "center",
          marginTop: 20,
          maxWidth: 280,
          width: "100%",
        }}
      >
        <Slider value={progress} max={1} />
      </View>
    </Index>
  );
}
