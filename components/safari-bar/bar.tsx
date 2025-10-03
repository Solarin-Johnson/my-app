import {
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  useWindowDimensions,
} from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ProgressiveFade from "../ProgressiveFade";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GlassContainer, GlassView } from "expo-glass-effect";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedTextWrapper } from "../ThemedText";
import Entypo from "@expo/vector-icons/Entypo";

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

const BUTTON_SIZE = 50;
const GAP = 8;
const SPACING = 24;
const BAR_COLLAPSED_WIDTH = 100;
const SCROLL_THRESHOLD = 40;

export default function Bar({
  scrollY,
  isScrollEnd,
}: {
  scrollY: SharedValue<number>;
  isScrollEnd: SharedValue<boolean>;
}) {
  const { bottom } = useSafeAreaInsets();
  const isExpanded = useSharedValue(true);
  const prevScrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const progress = useSharedValue(0);

  useAnimatedReaction(
    () => isScrollEnd.value,
    (ended) => {
      if (ended) {
        lastScrollY.value = scrollY.value;
        progress.value = withTiming(progress.value > 0.5 ? 1 : 0, {
          duration: 300,
        });
      }
    }
  );

  useAnimatedReaction(
    () => scrollY.value,
    (currentScrollY) => {
      // Determine scroll direction
      const isScrollingDown = currentScrollY > prevScrollY.value;

      // Update expanded state based on direction
      if (Math.abs(currentScrollY - prevScrollY.value) > SCROLL_THRESHOLD) {
        isExpanded.value = !isScrollingDown;
      }

      // Calculate real-time progress based on scroll velocity
      const scrollDelta = currentScrollY - prevScrollY.value;
      const sensitivity = 0.01; // Adjust sensitivity as needed

      // Update progress directly based on scroll movement
      const newProgress = Math.max(
        0,
        Math.min(1, progress.value + scrollDelta * sensitivity)
      );
      progress.value = newProgress;

      // Update previous scroll position for next frame
      prevScrollY.value = currentScrollY;
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    // console.log(isExpanded.value, scrollY.value, prevScrollY.value);
    console.log(progress.value);

    return {
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [0.7, 1]),
        },
      ],
      opacity: isExpanded.value ? 1 : 0.8,
    };
  });

  return (
    <>
      {/* <ProgressiveFade direction="bottom" height={40} /> */}
      <Animated.View style={[styles.container, { bottom }, animatedStyle]}>
        <GlassContainer style={styles.glassContainer} spacing={GAP / 2}>
          <IconButton>
            <Entypo
              name="chevron-thin-left"
              size={23}
              style={{ opacity: 0.5 }}
            />
          </IconButton>
          <AddressBar />
          <IconButton>
            <Ionicons name="ellipsis-horizontal" size={24} />
          </IconButton>
        </GlassContainer>
      </Animated.View>
    </>
  );
}

const AddressBar = () => {
  const { width } = useWindowDimensions();
  const CALCULATED_SPACE = 2 * (BUTTON_SIZE + GAP + SPACING);
  const BAR_WIDE_WIDTH = width - CALCULATED_SPACE;

  const barAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: BAR_WIDE_WIDTH,
    };
  });
  return (
    <GlassButton buttonStyle={styles.bar} wrapperStyle={barAnimatedStyle}>
      <Text>Bar</Text>
    </GlassButton>
  );
};

const GlassButton = ({
  children,
  wrapperStyle,
  buttonStyle,
}: {
  children: React.ReactElement;
  wrapperStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}) => {
  return (
    <AnimatedGlassView
      glassEffectStyle="regular"
      isInteractive
      style={[styles.glassWrapper, wrapperStyle]}
    >
      <Pressable style={[styles.button, buttonStyle]}>{children}</Pressable>
    </AnimatedGlassView>
  );
};

const IconButton = ({ children }: { children: React.ReactElement }) => {
  return (
    <GlassButton>
      <ThemedTextWrapper>{children}</ThemedTextWrapper>
    </GlassButton>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    right: 0,
    left: 0,
    // backgroundColor: "red",
  },
  glassContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: GAP,
  },
  glassWrapper: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
  },
  button: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bar: {
    // width: 300,
  },
});
