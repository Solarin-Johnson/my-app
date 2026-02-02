import { Platform, Pressable } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import CustomizeScreen from "./customize";
import { ThemedView, ThemedViewWrapper } from "@/components/ThemedView";
import { useFancyText } from "./_layout";
import FancyText from "@/components/FancyText";

const words = ["Fancy Text Here", "Here comes another", "And another one!"];

const isIOS = Platform.OS === "ios";

export default function Index() {
  const { bounce, currentIndex } = useFancyText();

  return (
    <>
      <Pressable
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          // paddingTop: 320,
        }}
        onPress={() => {
          currentIndex.value = (currentIndex.value + 1) % words.length;
          isIOS && router.navigate("/fancy-text-demo/customize");
        }}
      >
        <FancyText
          words={words}
          currentIndex={currentIndex}
          textProps={{ style: { fontSize: 30 } }}
          bounce={bounce}
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
