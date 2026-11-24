import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BalanceCard from "@/components/dummy-balance/balance-card";
import ActionSection from "@/components/dummy-balance/action-section";
import { useDummyBalPortalContext } from "@/components/dummy-balance/dummybal-portal-context";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import RecentsTransactions from "@/components/dummy-balance/recents";

export default function index() {
  const { rotateProgress } = useDummyBalPortalContext();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            rotateProgress.value,
            [0.05, 1],
            [1, 0.95],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <SafeAreaView style={styles.container}>
        <BalanceCard />
        <ActionSection />
        <RecentsTransactions />
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
