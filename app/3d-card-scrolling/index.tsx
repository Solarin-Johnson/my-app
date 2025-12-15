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
import { ThemedText } from "@/components/ThemedText";
import { GlassView } from "expo-glass-effect";

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
        contentContainerStyle={{
          padding: 16,
          gap: 16,
          paddingBottom: LENGTH < 3 ? 0 : Math.min(180, LENGTH * 30),
        }}
        contentInsetAdjustmentBehavior="automatic"
        contentInset={{ top: Math.max(-100, LENGTH * -10) }}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: LENGTH }).map((_, index) => (
          <Card
            key={index}
            index={index}
            scrollY={scrollY}
            scrollHeight={scrollHeight}
          />
        ))}
      </Animated.ScrollView>
    </ThemedViewWrapper>
  );
}

const Card = ({
  scrollY,
  scrollHeight,
  index,
}: {
  scrollY: SharedValue<number>;
  scrollHeight: SharedValue<number>;
  index?: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const h = scrollHeight.value;
    console.log(h);

    const indexFactor = 1 - (1 - (index ?? 0)) * (0.015 / (LENGTH / 10));
    const rotateX =
      interpolate(
        scrollY.value,
        h <= 0 ? [-200, 0, h + 200] : [-200, 0, h, h + 200],
        h <= 0 ? [-80, -65, -70] : [-80, -75, -70, -60]
        //   Extrapolation.EXTEND
      ) *
      Math.max(1, (5 - LENGTH) * 0.4) *
      indexFactor;

    return {
      transform: [
        {
          perspective: 1600,
        },
        { rotateX: `${rotateX}deg` },
        { scaleY: 1.6 },
        { scaleX: 0.78 },
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
        <GlassView
          style={styles.card}
          tintColor="#FFFFFF0D"
          //   isInteractive
          //   glassEffectStyle="clear"
        >
          {/* <ThemedText>Hello There</ThemedText> */}
          <ThemedView style={styles.box} />
          <View style={styles.dotWrapper}>
            <ThemedView style={styles.dot} />
            <ThemedView style={styles.textBlock} />
          </View>
        </GlassView>
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
    // experimental_backgroundImage:
    //   "linear-gradient(to bottom, #888888 0%, #88888880 100%)",
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
