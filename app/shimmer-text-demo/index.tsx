import { Pressable, View } from "react-native";
import React from "react";
import ShimmeringText from "@/components/ui/ShimmeringText";
import { useShimmerText } from "./_layout";
import { Link } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Index() {
  const { progress, playing, rtl, color, loop, size, duration } = useShimmerText();
  console.log(color);

  return (
    <Link href="/shimmer-text-demo/customize" asChild>
      <Pressable
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ShimmeringText
          text="Cooking..."
          // layerStyle={{ backgroundColor: "red" }}
          textStyle={{ fontSize: 28 }}
          progress={progress}
          start={playing}
          color={color}
          duration={duration}
          size={size}
          rtl={rtl}
        />
      </Pressable>
    </Link>
  );
}
