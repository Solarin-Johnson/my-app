import { Platform, Pressable } from "react-native";
import React from "react";
import ShimmeringText from "@/components/ui/ShimmeringText";
import { useShimmerText } from "./_layout";
import { Link, router } from "expo-router";

const isIOS = Platform.OS === "ios";

export default function Index() {
  const { progress, playing, rtl, color, size, duration, tintColor, text } =
    useShimmerText();
  console.log(color);

  return (
    <>
      <Pressable
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        onPress={() => {
          isIOS && router.push("/shimmer-text-demo/customize");
        }}
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
