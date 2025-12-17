import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import IOSCameraControl from "@/components/iOSCameraControl";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: isWeb ? 64 : 24,
      }}
    >
      <IOSCameraControl />
    </SafeAreaView>
  );
}
