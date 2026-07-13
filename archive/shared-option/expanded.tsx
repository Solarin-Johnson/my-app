import { StyleSheet, Pressable } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import { router } from "expo-router";
import { SHARED_DATA } from "@/constants";
import { Image } from "expo-image";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function Index() {
  const colors = ["red", "blue", "green", "yellow"];
  const IMAGES = SHARED_DATA.apps.map((app) => app.logo);

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        router.back();
      }}
    >
      {IMAGES.map((image, index) => (
        <AnimatedImage
          key={index}
          sharedTransitionTag={`peek-image-${index}`}
          style={styles.box}
          source={image}
          contentFit="cover"
          cachePolicy={"memory-disk"}
        />
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    gap: 24,
    paddingHorizontal: 24,
  },
  box: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
  },
});
