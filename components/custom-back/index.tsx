import { router, usePathname } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedViewWrapper } from "../ThemedView";
import PressableBounce from "../PresableBounce";
import Animated, {
  Easing,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";
import { BlurView } from "expo-blur";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 120,
  mass: 1.2,
  overshootClamping: true,
  restDisplacementThreshold: 0.0001,
  restSpeedThreshold: 0.0001,
};

const COLLAPSE_SPRING_CONFIG = {
  damping: 20,
  stiffness: 160,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.0001,
  restSpeedThreshold: 0.0001,
};

const SLOW_SPRING_CONFIG = {
  damping: 15,
  stiffness: 120,
  mass: 1,
  overshootClamping: true,
};

const FAST_SPRING = {
  damping: 18,
  stiffness: 250,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.0001,
  restSpeedThreshold: 0.0001,
};

const SPACING = 4;
const WIDTH = 48;
const HEIGHT = 48;
const EXPANDED_WIDTH = 240;

interface CustomBackProps {
  children: React.ReactNode;
}

const CustomBack: React.FC<CustomBackProps> = ({ children }) => {
  const [history, setHistory] = useState<string[]>([]);
  const bg = useThemeColor("background");
  const pathname = usePathname();
  const canGoBack = useSharedValue(false);
  const expanded = useSharedValue(false);
  const itemNum = useSharedValue(1);
  const scale = useSharedValue(1);
  const expanded_animated = useSharedValue(true);

  const applySpring = (
    value: number,
    slow?: boolean,
    callback?: () => void,
  ) => {
    "worklet";
    return withSpring(
      value,
      slow
        ? SLOW_SPRING_CONFIG
        : expanded.value
          ? SPRING_CONFIG
          : COLLAPSE_SPRING_CONFIG,
      callback,
    );
  };

  const animation_progress = useDerivedValue(() => {
    return applySpring(expanded.value ? 1 : 0);
  });
  const iconBlurIntensity = useDerivedValue<undefined | number>(() => {
    return applySpring(expanded.value ? 50 : 0);
  });
  const blurIntensity = useDerivedValue<undefined | number>(() => {
    return applySpring(expanded.value ? 0 : 50);
  });

  useEffect(() => {
    setHistory((prev) => {
      const existingIndex = prev.lastIndexOf(pathname);

      let next: string[];

      if (existingIndex !== -1) {
        // Going back (or revisiting)
        next = prev.slice(0, existingIndex + 1);
      } else {
        // Going forward
        next = [...prev, pathname];
      }

      console.log("Route stack:", next);

      canGoBack.value = next.length > 1;
      itemNum.value = next.length - 1;

      return next;
    });
  }, [pathname]);

  const animatedStyle = useAnimatedStyle(() => {
    const h = expanded.value ? HEIGHT * itemNum.value + SPACING * 2 : HEIGHT;
    const is_animated = animation_progress.value < 0.1;
    return {
      width: withSpring(
        expanded.value ? EXPANDED_WIDTH : WIDTH,
        FAST_SPRING,
        () => {
          expanded_animated.value = false;
        },
      ),
      height: withSpring(h, FAST_SPRING),
      opacity: applySpring(canGoBack.value || !is_animated ? 1 : 0),
      pointerEvents: canGoBack.value ? "auto" : "none",
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: 250,
            easing: Easing.inOut(Easing.ease),
          }),
        },
        {
          translateX: interpolate(
            animation_progress.value,
            [0, 0.5, 1],
            [0, expanded.value ? WIDTH / 4 : WIDTH / 2, 0],
          ),
        },
        {
          translateY: interpolate(
            animation_progress.value,
            [0, 0.5, 1],
            [0, expanded.value ? WIDTH / 4 : HEIGHT / 2, 0],
          ),
        },
      ],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: expanded.value ? "auto" : "none",
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded.value ? 0 : 1, {
        duration: expanded.value ? 150 : 250,
        easing: Easing.inOut(Easing.ease),
      }),
      transform: [{ scale: applySpring(expanded.value ? 4 : 1) }],
    };
  });

  const historyAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded.value ? 1 : 0, {
        duration: expanded.value ? 200 : 150,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  useAnimatedReaction(
    () => expanded.value,
    (value) => {
      expanded_animated.value = true;
    },
  );

  return (
    <>
      {children}
      <AnimatedPressable
        style={[StyleSheet.absoluteFill, overlayStyle]}
        onPressIn={() => {
          expanded.value = false;
        }}
      />
      <AnimatedPressable
        style={[
          styles.backButton,
          {
            outlineColor: "#ffffff20",
          },
          animatedStyle,
        ]}
        onPressIn={() => {
          scale.value = 1.2;
        }}
        onPressOut={() => {
          scale.value = 1;
        }}
        onPress={() => {
          if (!router.canGoBack() || expanded.value) return;
          router.back();

          // router.back();
        }}
        onLongPress={() => {
          expanded.value = !expanded.value;
          scale.value = 1;
        }}
        delayLongPress={400}
      >
        <AnimatedBlurView
          style={[
            styles.blurUnderlay,
            {
              backgroundColor: bg + "20",
            },
          ]}
          intensity={blurIntensity}
        />
        <Animated.View style={[styles.icon, iconAnimatedStyle]}>
          <ThemedTextWrapper>
            <ChevronLeft size={30} style={{ marginLeft: -2 }} />
          </ThemedTextWrapper>
        </Animated.View>
        <AnimatedBlurView
          style={StyleSheet.absoluteFill}
          intensity={iconBlurIntensity}
        />
        <Animated.View style={[styles.history, historyAnimatedStyle]}>
          {history.map((item, index) =>
            index === history.length - 1 ? null : (
              <Pressable
                key={index}
                style={styles.historyItem}
                onPress={() => {
                  const stepsBack = history.length - 1 - index;
                  for (let i = 0; i < stepsBack; i++) {
                    router.back();
                  }
                  expanded.value = false;
                }}
              >
                <ThemedText>
                  {item.split("/").slice(-1)[0] || "root"}
                </ThemedText>
              </Pressable>
            ),
          )}
        </Animated.View>
      </AnimatedPressable>
    </>
  );
};

export default CustomBack;

const styles = StyleSheet.create({
  backButton: {
    borderRadius: WIDTH / 2 + SPACING,
    position: "absolute",
    top: 62,
    left: 16,
    zIndex: 999,
    boxShadow: "0 5px 30px #00000024",
    overflow: "hidden",
    outlineWidth: 0.8,
  },
  icon: {
    flex: 1,
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    // position: "absolute",
  },
  blurUnderlay: {
    ...StyleSheet.absoluteFill,
  },
  history: {
    position: "absolute",
    // flex: 1,
    top: SPACING,
  },
  text: {
    textAlign: "left",
  },
  historyItem: {
    height: HEIGHT,
    width: EXPANDED_WIDTH - SPACING * 2,
    marginHorizontal: SPACING,
    borderRadius: HEIGHT / 2,
    justifyContent: "center",
    // backgroundColor: "#ffffff10",
    paddingHorizontal: SPACING * 6,
  },
});
