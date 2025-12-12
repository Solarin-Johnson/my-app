import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedView, ThemedViewWrapper } from "@/components/ThemedView";

const LENGTH = 10;

export default function Index() {
  const scrollY = useSharedValue(0);
  const scrollHeight = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      scrollHeight.value =
        event.contentSize.height - event.layoutMeasurement.height;
    },
  });
  return (
    <ThemedViewWrapper style={{ backgroundColor: "#000" }}>
      <Animated.ScrollView
        style={styles.container}
        onScroll={scrollHandler}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 180 }}
        // contentInsetAdjustmentBehavior="automatic"
        contentInset={{ top: LENGTH * -1 }}
        scrollEventThrottle={16}
      >
        {Array.from({ length: LENGTH }).map((_, index) => (
          <Card
            key={index}
            scrollY={scrollY}
            scrollHeight={scrollHeight}
            totalCards={LENGTH}
          />
        ))}
      </Animated.ScrollView>
    </ThemedViewWrapper>
  );
}

const Card = ({
  scrollY,
  scrollHeight,
}: {
  scrollY: SharedValue<number>;
  scrollHeight: SharedValue<number>;
  totalCards?: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const h = scrollHeight.value;
    const rotateX = interpolate(
      scrollY.value,
      [-200, 0, h, h + 200],
      [-80, -75, -70, -65]
      //   Extrapolation.EXTEND
    );

    return {
      transform: [
        {
          perspective: 1500,
        },
        { rotateX: `${rotateX}deg` },
        { scaleY: 1.4 },
        { scaleX: 0.8 },
      ],
      zIndex: 1,
    };
  });

  return (
    <View
      style={[
        styles.cardWrapper,
        {
          height: Math.max(115, (1 / LENGTH) * 700),
        },
      ]}
    >
      <Animated.View style={[animatedStyle]}>
        <ThemedView style={styles.card}>
          <ThemedView style={styles.box} colorName="cardBg3D" />
          <View style={styles.dotWrapper}>
            <ThemedView style={styles.dot} colorName="cardBg3D" />
            <ThemedView style={styles.textBlock} colorName="cardBg3D" />
          </View>
        </ThemedView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    height: 600,
    width: "100%",
    boxShadow: "0 0 60px rgba(0, 0, 0, 0.15)",
    borderRadius: 36,
    padding: 16,
    borderCurve: "continuous",
    gap: 12,
    // backgroundColor: "grey",
    experimental_backgroundImage:
      "linear-gradient(to bottom, #ffffff08 0%, #ffffff08 100%)",
  },
  cardWrapper: {
    // width: "100%",
    // overflow: "hidden",
  },
  box: {
    height: 160,
    borderRadius: 20,
    width: "100%",
    borderCurve: "continuous",
  },
  dotWrapper: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 36,
    aspectRatio: 1,
    borderRadius: "50%",
    marginHorizontal: 4,
  },
  textBlock: {
    height: 36,
    flex: 1,
    borderRadius: 18,
  },
});
