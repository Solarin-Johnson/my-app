import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BalanceCard from "@/components/dummy-balance/balance-card";

export default function index() {
  return (
    <SafeAreaView style={styles.container}>
      <BalanceCard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
