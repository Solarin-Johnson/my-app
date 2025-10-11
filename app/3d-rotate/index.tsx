import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Rotate3d from "@/components/3dRotate";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Rotate3d />
    </SafeAreaView>
  );
}
