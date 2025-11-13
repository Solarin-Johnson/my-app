import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useNotify } from ".";
import Animated, {
  FadeInUp,
  SharedValue,
  SlideInUp,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { MessageType } from "./type";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOP_OFFSET = 60;
const HEIGHT = 72;

export default function Banner({
  message,
  index,
  messageCount,
}: {
  message: MessageType;
  index: number;
  messageCount: SharedValue<number>;
}) {
  const hidden = useSharedValue(false);
  const mounted = useSharedValue(false);

  useEffect(() => {
    mounted.value = true;
    const timer = setTimeout(() => {
      hidden.value = true;
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const isCurrent = index === messageCount.value - 1;
    const isHidden = hidden.value || !isCurrent;
    const isMounted = mounted.value;
    return {
      transform: [
        {
          translateY: hidden.value
            ? withSpring(-(HEIGHT + TOP_OFFSET))
            : withSpring(0),
        },
        {
          scale: withTiming(isHidden ? 0.8 : 1, {
            duration: 300,
          }),
        },
      ],
      pointerEvents: isHidden ? "none" : "auto",
      opacity: withTiming(isHidden ? 0 : 1, { duration: 300 }),
    };
  });

  return (
    <Animated.View style={[styles.banner, animatedStyle]} entering={SlideInUp}>
      <Text style={styles.text}>{message.text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 20,
    right: 20,
    top: TOP_OFFSET,
    height: HEIGHT,
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    zIndex: 999,
    transformOrigin: "top center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});
