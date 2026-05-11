import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";

export default function index() {
  return (
    <View style={styles.container}>
      <Link href="/stacked-button/sheet">
        <ThemedText>Go to Customize</ThemedText>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
