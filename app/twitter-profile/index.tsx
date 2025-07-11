import { ThemedText } from "@/components/ThemedText";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  SharedValue,
  useDerivedValue,
  useAnimatedReaction,
  interpolate,
  Extrapolation,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";

const FULL_HEADER_HEIGHT = 160;
const COLLAPSED_HEADER_HEIGHT = 50;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function TwitterProfile() {
  const scrollY = useSharedValue(0);
  const { top } = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <>
      <Header scrollY={scrollY} />
      <Animated.ScrollView
        style={styles.container}
        onScroll={scrollHandler}
        // contentInsetAdjustmentBehavior={"automatic"}
        contentContainerStyle={{ paddingTop: FULL_HEADER_HEIGHT }}
      >
        <ThemedView
          style={{
            height: 1500,
          }}
        />
      </Animated.ScrollView>
    </>
  );
}

function Header({ scrollY }: { scrollY: SharedValue<number> }) {
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const intensity = useSharedValue<number | undefined>(0);

  useAnimatedReaction(
    () => scrollY.value,
    (value) => {
      intensity.value = interpolate(
        Math.abs(value),
        [0, FULL_HEADER_HEIGHT],
        [0, 32],
        Extrapolation.CLAMP
      );
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, FULL_HEADER_HEIGHT],
        [FULL_HEADER_HEIGHT, COLLAPSED_HEADER_HEIGHT + top],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <>
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: top,
          },
          animatedStyle,
        ]}
        pointerEvents={"box-none"}
      >
        <CoverImage intensity={intensity} />
      </Animated.View>
    </>
  );
}

const CoverImage = ({
  style,
  intensity,
}: {
  style?: object;
  intensity: SharedValue<number | undefined>;
}) => {
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          height: FULL_HEADER_HEIGHT,
          overflow: "hidden",
        },
        style,
      ]}
      pointerEvents="none"
    >
      <Image
        source={
          "https://pbs.twimg.com/profile_banners/1674810013007659014/1752253038/1500x500"
        }
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />
      <AnimatedBlurView
        intensity={intensity}
        style={StyleSheet.absoluteFillObject}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 1,
    overflow: "hidden",
  },
});
