import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BalanceCard from "@/components/dummy-balance/balance-card";
import ActionSection from "@/components/dummy-balance/action-section";
import { useDummyBalPortalContext } from "@/components/dummy-balance/dummybal-portal-context";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import RecentsTransactions, {
  QuickSend,
} from "@/components/dummy-balance/recents";
import FloatingBar from "@/components/dummy-balance/floating-bar";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { SPRING_CONFIG } from "@/constants";

export default function index() {
  const { rotateProgress } = useDummyBalPortalContext();
  const background = useThemeColor("background");
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      if (y < 50) {
        scrollY.value = y;
      }
    },
  });

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

  const edgeFadeAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(
        interpolate(scrollY.value, [0, 30], [0, 1], Extrapolation.CLAMP),
        SPRING_CONFIG,
      ),
    };
  });

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.block}>
          <BalanceCard />
          <ActionSection />
        </View>

        <Animated.ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          onScroll={scrollHandler}
        >
          <View
            style={[
              styles.edgeFade,
              {
                height: 80,
              },
            ]}
          >
            <Animated.View
              style={[
                {
                  flex: 1,
                },
                edgeFadeAnimatedStyle,
              ]}
            >
              <LinearGradient
                style={{ flex: 1 }}
                colors={[
                  background + "00",
                  background + "90",
                  background + "DD",
                  background,
                ]}
                locations={[1, 0.6, 0.3, 0]}
              />
            </Animated.View>
          </View>
          <QuickSend />
          <View style={styles.block}>
            <RecentsTransactions />
          </View>
        </Animated.ScrollView>
        <FloatingBar />
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  block: {
    paddingHorizontal: 20,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  edgeFade: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 50,
    zIndex: 1,
                pointerEvents: "none",

  },
});
