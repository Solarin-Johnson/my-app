import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DynamicToast() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.toastContainer, { bottom }]}>
      <Text style={styles.toastText}></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
  },
  toastText: {
    color: "#fff",
    fontSize: 16,
  },
});
