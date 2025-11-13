import { StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import Animated, {
  Easing,
  SharedValue,
  SlideInUp,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { MessageType } from "./type";
import { BlurView } from "expo-blur";
import { ThemedText } from "../ThemedText";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

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
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const scheduleHide = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      if (hidden.value) return;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      isDragging.value = false;
      if (translateY.value < -50) {
        hidden.value = true;
      } else {
        translateY.value = withSpring(0);
      }
    });

  useAnimatedReaction(
    () => isDragging.value,
    (current, previous) => {
      if (current) {
        scheduleHide.value = 0;
      } else {
        scheduleHide.value = withTiming(1, { duration: 3000 }, (finished) => {
          if (finished) {
            hidden.value = true;
          }
        });
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    const isCurrent = index === messageCount.value - 1;
    const isHidden = hidden.value || !isCurrent;
    return {
      transform: [
        {
          translateY: hidden.value
            ? withSpring(-(HEIGHT + TOP_OFFSET))
            : 0 + translateY.value,
        },
        {
          scale: withTiming(!isCurrent ? 0.8 : 1, {
            duration: 300,
          }),
        },
      ],
      pointerEvents: isHidden ? "none" : "auto",
      opacity: withTiming(isHidden ? 0 : 1),
    };
  });

  return (
    <Animated.View entering={SlideInUp.springify()}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.banner, animatedStyle]}>
          <BlurView style={styles.content} intensity={80}>
            <ThemedText style={styles.text}>{message.text}</ThemedText>
          </BlurView>
        </Animated.View>
      </GestureDetector>
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
    borderRadius: 12,
    zIndex: 999,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  text: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    backgroundColor: "#88888890",
    padding: 12,
  },
});
