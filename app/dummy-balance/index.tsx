import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BalanceCard from "@/components/dummy-balance/balance-card";
import { ThemedText } from "@/components/ThemedText";
import ActionSection from "@/components/dummy-balance/action-section";

export default function index() {
  return (
    <SafeAreaView style={styles.container}>
      <BalanceCard />
      <ActionSection />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
