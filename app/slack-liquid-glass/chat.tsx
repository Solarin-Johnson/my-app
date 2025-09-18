import { ThemedView } from "@/components/ThemedView";
import { Text, StyleSheet } from "react-native";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <Text>Index</Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
