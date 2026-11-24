import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemedText } from "../ThemedText";

export default function RecentsTransactions() {
  return (
    <View style={styles.container}>
      <Header />
    </View>
  );
}

const Header = () => {
  return (
    <View style={styles.header}>
      <ThemedText style={styles.title}>Transactions</ThemedText>
      <ThemedText style={styles.subtitle}>View all</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 3,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 23,
    fontFamily: "ui-monospace",
    fontWeight: 600,
    letterSpacing: -1.75,
  },
  subtitle: {
    fontFamily: "ui-monospace",
    letterSpacing: -1.75,
    fontWeight: 600,
    opacity: 0.5,
  },
});
