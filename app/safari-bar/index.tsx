import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import ProgressiveFade from "@/components/ProgressiveFade";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";

const FADE_HEIGHT = 4;

export default function SafariBar() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        scrollIndicatorInsets={{ top: FADE_HEIGHT }}
      >
        <SafeAreaView>
          <View style={{ height: 1500 }}>
            <ThemedText>SafariBar</ThemedText>
            <View style={styles.box} />
          </View>
        </SafeAreaView>
      </Animated.ScrollView>
      <ProgressiveFade direction="top" height={FADE_HEIGHT} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: FADE_HEIGHT,
  },
  box: {
    height: 120,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "#88888820",
  },
});
