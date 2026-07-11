import { View, Text, Platform, StyleSheet } from "react-native";
import React from "react";
import { BlankStack } from "@/layouts/blank-stack";
import { makeMutable } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Transition from "react-native-screen-transitions";
import { SPRING_CONFIG } from "@/constants";

// const navigationZoomId = makeMutable<string | null>(null);

export default function Detail() {
  return (
    <>
      <BlankStack.Screen
        options={{
          ...Transition.Presets.ZoomIn,
        }}
      />
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "red",
        }}
      >
        <Image
          source={require("@/assets/images/dp.png")}
          style={styles.artwork}
        />

        <ThemedText>Detail</ThemedText>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  artwork: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});
