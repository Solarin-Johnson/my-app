import React from "react";
import { BlankStack } from "@/layouts/blank-stack";
import { Platform } from "react-native";
import { makeMutable } from "react-native-reanimated";

export default function ZoomLayout() {
  return (
    <BlankStack>
      <BlankStack.Screen name="index" />
      <BlankStack.Screen name="detail" />
    </BlankStack>
  );
}
