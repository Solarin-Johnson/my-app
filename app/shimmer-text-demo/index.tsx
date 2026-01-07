import { Pressable } from "react-native";
import React from "react";
import ShimmeringText from "@/components/ui/ShimmeringText";
import { useShimmerText } from "./_layout";
import { Link } from "expo-router";

export default function Index() {
  const { progress, playing, rtl, color, size, duration, tintColor, text } =
    useShimmerText();
  console.log(color);

  return (
    <Link href="/shimmer-text-demo/customize" asChild>
      <Pressable
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ShimmeringText
          text={text}
          // layerStyle={{ backgroundColor: "red" }}
          textStyle={{ fontSize: 28 }}
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
  );
}
