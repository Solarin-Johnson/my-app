import {
  View,
  Text,
  StyleSheet,
  ViewProps,
  useColorScheme,
} from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { ThemedTextWrapper } from "./ThemedText";
import { GlassView } from "expo-glass-effect";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { Feedback } from "@/functions";
import { useThemeColor } from "@/hooks/useThemeColor";

const GAP = 70;
const REC_CONTAINER_SIZE = 82;
const REC_SIZE = 70;
const DRAGGABLE_SIZE = 42;
const CONTROL_ITEM_SIZE = 54;
const TRANSLATE_X_THRESHOLD =
  GAP + (REC_CONTAINER_SIZE + CONTROL_ITEM_SIZE) / 2 - REC_SIZE / 2;
const DRAGGABLE_LEFT = (REC_CONTAINER_SIZE - DRAGGABLE_SIZE) / 2;

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);
const AnimatedBlurView = Animated.createAnimatedComponent(View);
const AnimatedThemedView = Animated.createAnimatedComponent(ThemedView);

const HapticFeedback = () => {
  Feedback.selection();
};

export default function IOSCameraControl() {
  const progress = useSharedValue(0);
  const pressed = useSharedValue(false);
  const tapped = useSharedValue(false);
  const appleRed = useThemeColor("appleRed");
  const snappedToRight = useSharedValue(false);

  const escaped = useDerivedValue(() => {
    return progress.value > 0.25;
  });

  useAnimatedReaction(
    () => escaped.value,
    (isEscaped) => {
      pressed.value && scheduleOnRN(HapticFeedback);
    }
  );

  const panGesture = Gesture.Pan()
    .onTouchesDown(() => {
      pressed.value = true;
    })
    .onTouchesCancelled(() => {
      pressed.value = false;
    })
    .onTouchesUp(() => {
      pressed.value = false;
    })
    .onUpdate((e) => {
      if (snappedToRight.value) return;
      tapped.value = false;

      progress.value = Math.min(
        1,
        Math.max(0, e.translationX / TRANSLATE_X_THRESHOLD)
      );
    })
    .onEnd(() => {
      progress.value = withSpring(escaped.value ? 1 : 0);
      pressed.value = false;
      snappedToRight.value = progress.value === 1;
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    tapped.value = true;
    progress.value = progress.value > 0 ? 0 : 1;
  });

  const combinedGesture = Gesture.Simultaneous(panGesture, tapGesture);

  const snappedPanGesture = Gesture.Pan()
    .onTouchesDown(() => {
      snappedToRight.value && (pressed.value = true);
    })
    .onTouchesCancelled(() => {
      pressed.value = false;
    })
    .onTouchesUp(() => {
      pressed.value = false;
    })
    .onUpdate((e) => {
      progress.value = Math.max(
        0,
        Math.min(1, 1 + e.translationX / TRANSLATE_X_THRESHOLD)
      );
      console.log(progress.value);
    })
    .onEnd(() => {
      progress.value = withSpring(escaped.value ? 1 : 0);
      pressed.value = false;
    });

  const draggableAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: progress.value * TRANSLATE_X_THRESHOLD,
        },
      ],
      left: withTiming(DRAGGABLE_LEFT + (escaped.value ? REC_SIZE / 2 : 0), {
        duration: tapped.value ? 0 : 200,
      }),
      backgroundColor: withTiming(escaped.value ? "#FFFFFF" : appleRed, {
        duration: escaped.value ? 100 : 40,
        easing: Easing.in(Easing.ease),
      }),
      opacity: progress.value > 0 ? 1 : 0,
    };
  });

  const recButtonAnimatedStyle = useAnimatedStyle(() => {
    const scale = escaped.value
      ? 0.55
      : pressed.value
      ? 0.9 - progress.value / 3
      : 1;
    return {
      transform: [
        {
          scale: withSpring(scale),
        },
      ],
      borderRadius: withTiming(escaped.value ? 16 : 35),
    };
  });

  const lockAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(escaped.value ? 1 : 0.7),
        },
      ],
    };
  });

  const lockIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(escaped.value ? 0 : 1, {
        duration: 200,
      }),
    };
  });

  return (
    <View style={styles.container}>
      <ControlItem>
        <ThemedTextWrapper>
          <Octicons name="pause" size={24} color="black" />
        </ThemedTextWrapper>
      </ControlItem>
      <GestureDetector gesture={combinedGesture}>
        <ControlItem size={REC_CONTAINER_SIZE} glass style={{ zIndex: 2 }}>
          <Animated.View
            style={[styles.recButton, styles.draggable, draggableAnimatedStyle]}
          />
          <AnimatedThemedView
            style={[styles.recButton, recButtonAnimatedStyle]}
            colorName="appleRed"
          />
        </ControlItem>
      </GestureDetector>
      <GestureDetector gesture={snappedPanGesture}>
        <Animated.View style={lockAnimatedStyle}>
          <ControlItem>
            <Animated.View style={lockIconAnimatedStyle}>
              <ThemedTextWrapper style={{ opacity: 0.5 }}>
                <Ionicons name="lock-closed" size={23} />
              </ThemedTextWrapper>
            </Animated.View>
          </ControlItem>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const ControlItem: React.FC<
  {
    children?: React.ReactNode;
    size?: number;
    visible?: SharedValue<boolean>;
    glass?: boolean;
  } & ViewProps
> = ({ children, size = CONTROL_ITEM_SIZE, visible, glass, ...props }) => {
  const isDark = useColorScheme() === "dark";
  const animatedStyle = useAnimatedStyle(() => {
    const isVisible = visible?.value ?? true;
    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.5),
        },
      ],
    };
  });

  const Wrapper = glass ? AnimatedGlassView : AnimatedBlurView;
  const wrapperProps = glass
    ? {
        tintColor: isDark ? "transparent" : "#00000030",
      }
    : {
        intensity: 100,
      };

  return (
    <Wrapper
      {...props}
      style={[
        styles.controlItem,
        {
          backgroundColor: glass ? "transparent" : "#88888830",
          width: size,
        },
        props.style,
        animatedStyle,
      ]}
      {...wrapperProps}
    >
      {children}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    gap: GAP,
    paddingHorizontal: "10%",
    flexDirection: "row",
    alignItems: "center",
  },
  controlItem: {
    aspectRatio: 1,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  recButton: {
    width: REC_SIZE,
    aspectRatio: 1,
    borderCurve: "continuous",
  },
  draggable: {
    position: "absolute",
    width: DRAGGABLE_SIZE,
    borderRadius: "50%",
  },
});
