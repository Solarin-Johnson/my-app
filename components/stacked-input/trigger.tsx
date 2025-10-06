import { View } from "react-native";
import React, { ReactElement, cloneElement, ComponentProps } from "react";
import { SharedValue } from "react-native-reanimated";

interface TriggerProps {
  type: "next" | "previous";
  min?: number;
  max?: number;
  currentIndex: SharedValue<number>;
  children: ReactElement<ComponentProps<any> & { onPress?: () => void }>;
}

export default function Trigger({
  type,
  min = 0,
  max = 1,
  currentIndex,
  children,
}: TriggerProps) {
  const handleNext = () => {
    if (currentIndex.value < max) {
      currentIndex.value += 1;
    }
  };

  const handlePrevious = () => {
    if (currentIndex.value > min) {
      currentIndex.value -= 1;
    }
  };

  return cloneElement(children, {
    onPress: type === "next" ? handleNext : handlePrevious,
  });
}
