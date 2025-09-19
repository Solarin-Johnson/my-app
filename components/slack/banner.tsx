import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { ThemedText } from "../ThemedText";
import { DATA } from "./config";

export default function SlackBanner() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/dp.png")}
        style={styles.image}
      />
      <ThemedText type="bold" colorName="slackText" style={styles.title}>
        {DATA.name}
      </ThemedText>
      <ThemedText colorName="slackText" style={styles.sub}>
        {DATA.bannerText}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // backgroundColor: "lightgray",
  },
  image: {
    width: 54,
    aspectRatio: 1,
    borderRadius: 12,
    borderCurve: "continuous",
  },
  title: {
    fontSize: 21,
    marginVertical: 12,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  sub: {
    fontSize: 17,
    marginVertical: 8,
    lineHeight: 23,
    opacity: 0.8,
  },
});
