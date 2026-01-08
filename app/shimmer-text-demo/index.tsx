import { Pressable } from "react-native";
import React from "react";
import ShimmeringText from "@/components/ui/ShimmeringText";
import { useShimmerText } from "./_layout";
import { Link } from "expo-router";
import CustomizeScreen from "./customize";
import { ThemedView, ThemedViewWrapper } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { progress, playing, rtl, color, size, duration, tintColor, text } =
    useShimmerText();
  console.log(color);

  return (
    <>
      <Link href="/shimmer-text-demo/customize" asChild>
        <Pressable
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ShimmeringText
            text={text}
            // layerStyle={{ backgroundColor: "red" }}
            textStyle={{ fontSize: 36 }}
            progress={progress}
            start={playing}
            color={color}
            duration={duration}
            size={size}
            rtl={rtl}
            tintColor={tintColor}
          />
        </Pressable>
      </Link>
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
