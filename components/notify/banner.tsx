import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import React, { Fragment, useEffect } from "react";
import Animated, {
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
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { CardExpanded, CardHandle, CardPeek } from "./card";
import { isLiquidGlassAvailable, GlassView } from "expo-glass-effect";
import { scheduleOnRN } from "react-native-worklets";
import { Feedback } from "@/functions";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const TOP_OFFSET = 60;
const HEIGHT = 78;
const EXPANDED_HEIGHT = 500;
const RESISTANCE_FACTOR = 0.15;
const HIDE_DELAY = 3000;
const THRESHOLD = HEIGHT / 2;
const SLIDE_UP_DISTANCE = HEIGHT + TOP_OFFSET;
const VELOCITY_THRESHOLD = 500;
const DRAG_THRESHOLD = 20;
const HANDLE_HEIGHT = 10;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

const isLiquidGlass = isLiquidGlassAvailable();

const snapFeedback = () => {
  Feedback.soft();
};

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
  const hasExceededThreshold = useSharedValue(false);
  const mounted = useSharedValue(false);
  const { height } = useWindowDimensions();
  const EXPANDED_TOP = height / 2 - EXPANDED_HEIGHT / 2 - TOP_OFFSET;
  const notExpanded = useDerivedValue(() => {
    return !hasExceededThreshold.value;
  });

  const overLayIntensity = useDerivedValue<number | undefined>(() => {
    return withSpring(hasExceededThreshold.value ? 80 : 0);
  });

  useEffect(() => {
    mounted.value = true;
  }, []);

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .maxPointers(1)
    .onBegin(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      if (hidden.value || hasExceededThreshold.value) return;
      if (e.translationY > 0) {
        translateY.value = e.translationY * RESISTANCE_FACTOR;
        if (translateY.value > DRAG_THRESHOLD) {
          hasExceededThreshold.value = true;
        }
      } else {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      isDragging.value = false;
      if (hasExceededThreshold.value) return;
      if (translateY.value < -THRESHOLD || e.velocityY < -VELOCITY_THRESHOLD) {
        hidden.value = true;
      } else {
        translateY.value = withSpring(0);
      }
    });

  useAnimatedReaction(
    () => isDragging.value,
    (current) => {
      if (current) {
        scheduleHide.value = 0;
      } else if (!hasExceededThreshold.value) {
        scheduleHide.value = withTiming(
          1,
          { duration: HIDE_DELAY },
          (finished) => {
            if (finished) {
              hidden.value = true;
            }
          }
        );
      }
    }
  );

  useAnimatedReaction(
    () => hidden.value,
    (current) => {
      if (current) {
        hasExceededThreshold.value = false;
      }
    }
  );

  useAnimatedReaction(
    () => hasExceededThreshold.value,
    (current) => {
      if (current) {
        translateY.value = withSpring(EXPANDED_TOP);
        scheduleOnRN(snapFeedback);
      } else {
        translateY.value = withSpring(0);
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    const isCurrent = index === messageCount.value - 1;
    const isHidden = hidden.value || !isCurrent;
    const isExpanded = hasExceededThreshold.value;
    return {
      transform: [
        {
          translateY: hidden.value
            ? withSpring(-SLIDE_UP_DISTANCE)
            : 0 + translateY.value,
        },
        {
          scale: withTiming(!isCurrent ? 0.8 : 1, {
            duration: 300,
          }),
        },
      ],
      opacity: withTiming(isHidden && mounted.value ? 0 : 1),
      pointerEvents: isHidden ? "none" : "auto",
      height: withSpring(isExpanded ? EXPANDED_HEIGHT : HEIGHT),
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: hasExceededThreshold.value ? "auto" : "none",
    };
  });

  const expandedAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(hasExceededThreshold.value ? 1 : 0),
    };
  });

  const Blur = isLiquidGlass ? Fragment : BlurView;
  const blurProps = isLiquidGlass
    ? {}
    : {
        intensity: 80,
        styles: styles.content,
      };

  const Wrapper = isLiquidGlass ? AnimatedGlassView : Animated.View;

  return (
    <>
      <AnimatedPressable
        style={[StyleSheet.absoluteFillObject, overlayAnimatedStyle]}
        onPress={() => {
          hidden.value = true;
        }}
      >
        <AnimatedBlurView intensity={overLayIntensity} style={{ flex: 1 }} />
      </AnimatedPressable>
      <Animated.View
        entering={SlideInUp.withInitialValues({
          originY: -SLIDE_UP_DISTANCE * 2,
        }).springify()}
      >
        <GestureDetector gesture={panGesture}>
          <Wrapper style={[styles.banner, animatedStyle]}>
            <Blur>
              <CardPeek text={message.text} shown={notExpanded} />
              <Animated.View style={[styles.expanded, expandedAnimatedStyle]}>
                <CardExpanded />
              </Animated.View>
              <CardHandle shown={notExpanded} />
            </Blur>
          </Wrapper>
        </GestureDetector>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 20,
    right: 20,
    borderRadius: 24,
    zIndex: 999,
    borderCurve: "continuous",
    overflow: "hidden",
    top: TOP_OFFSET,
  },
  text: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    backgroundColor: "#88888888",
    paddingBottom: HANDLE_HEIGHT,
  },
  expanded: {
    ...StyleSheet.absoluteFillObject,
  },
});
