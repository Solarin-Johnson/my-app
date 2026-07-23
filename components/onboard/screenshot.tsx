import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  source: string | number;
};

export default function Screenshot({ source }: Props) {
  const { top } = useSafeAreaInsets();
  const topSpace = 60;
  return (
    <View style={[styles.container, { top: topSpace }]}>
      <Image source={source} style={styles.image} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 45,
    right: 45,
  },
  image: {
    borderRadius: 36,
    aspectRatio: 9 / 19.5,
    height: 675,
  },
});
