import { Pressable } from "react-native";
import React from "react";
import ShimmeringText from "@/components/ui/ShimmeringText";
import { Link } from "expo-router";
import CustomizeScreen from "./customize";
import { ThemedView, ThemedViewWrapper } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFancyText } from "./_layout";
import FancyText from "@/components/FancyText";
import { useSharedValue } from "react-native-reanimated";

const words = ["Fancy Text Here", "Here comes another", "And another one!"];

export default function Index() {
  const {} = useFancyText();
  const currentIndex = useSharedValue(0);

  return (
    <>
      <Pressable
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        onPress={() => {
          currentIndex.value = (currentIndex.value + 1) % words.length;
        }}
      >
        <FancyText
          words={words}
          currentIndex={currentIndex}
          // initDuration={800}
          // initOffsetY={50}
          // initDelay={90}
        />
      </Pressable>
      {/* <ThemedView
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          borderWidth: 1,
          borderColor: "#88888890",
          margin: 12,
          borderRadius: 24,
        }}
      >
        <CustomizeScreen />
      </ThemedView> */}
    </>
  );
}
