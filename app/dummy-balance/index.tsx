import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BalanceCard from "@/components/dummy-balance/balance-card";
import { ThemedText } from "@/components/ThemedText";

export default function index() {
  return (
    <SafeAreaView style={styles.container}>
      <BalanceCard />
      <ThemedText style={{ marginTop: 20, fontSize: 16 }}>
        This is a dummy balance card component. It demonstrates the 3D rotation
        effect and teleportation of the card when pressed.
      </ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
