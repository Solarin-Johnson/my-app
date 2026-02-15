import { router, usePathname, useSegments } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
const EXPANDED_WIDTH = 240;
const WIDTH = 44;
const HEIGHT = 44;

const isAndroid = Platform.OS === "android";

interface CustomBackProps {
  children: React.ReactNode;
  titles?: Record<string, string>;
  usePathTitles?: boolean;
}

type HistoryItem = {
  path: string;
  label: string;
};

const CustomBack: React.FC<CustomBackProps> = ({
  children,
  titles,
  usePathTitles,
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const bg = useThemeColor("untitledBg");
  const { top } = useSafeAreaInsets();

  const isDark = useColorScheme() === "dark";
  const size = isDark ? 45 : 44;

  const pathname = usePathname();
  const segments = useSegments();

  const canGoBack = useDerivedValue(() => {
    return history.length > 1;
  });
  const itemNum = useDerivedValue(() => {
    return history.length - 1;
  });

  const expanded = useSharedValue(false);
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
        : expanded.get()
          ? SPRING_CONFIG
          : COLLAPSE_SPRING_CONFIG,
      callback,
    );
  };

  const animation_progress = useDerivedValue(() => {
    return applySpring(expanded.get() ? 1 : 0);
  });
  const iconBlurIntensity = useDerivedValue<undefined | number>(() => {
    return applySpring(expanded.get() ? 50 : 0);
  });
  const blurIntensity = useDerivedValue<undefined | number>(() => {
    return applySpring(expanded.get() ? 0 : 50);
  });

  useEffect(() => {
    const lastSegment = segments[segments.length - 1];

    let label = lastSegment;

    setHistory((prev) => {
      const existingIndex = prev.findIndex((item) => item.path === pathname);

      let next: HistoryItem[];

      if (existingIndex !== -1) {
        next = prev.slice(0, existingIndex + 1);
      } else {
        next = [...prev, { path: pathname, label }];
      }

      return next;
    });
  }, [pathname, segments]);

  const animatedStyle = useAnimatedStyle(() => {
    const h = expanded.get()
      ? HEIGHT * itemNum.get() - HEIGHT + size + SPACING * 2
      : size;
    const is_animated = animation_progress.get() < 0.1;
    return {
      width: withSpring(
        expanded.get() ? EXPANDED_WIDTH : size,
        FAST_SPRING,
        () => {
          expanded_animated.set(false);
        },
      ),
      height: withSpring(h, FAST_SPRING),
      opacity: applySpring(canGoBack.get() || !is_animated ? 1 : 0),
      pointerEvents: canGoBack.get() ? "auto" : "none",
      transform: [
        {
          scale: withTiming(expanded.get() ? 1 : scale.get(), {
            duration: 250,
            easing: Easing.inOut(Easing.ease),
          }),
        },
        {
          translateX: interpolate(
            animation_progress.get(),
            [0, 0.5, 1],
            [0, expanded.get() ? WIDTH / 4 : WIDTH / 2, 0],
          ),
        },
        {
          translateY: interpolate(
            animation_progress.get(),
            [0, 0.5, 1],
            [0, expanded.get() ? WIDTH / 4 : HEIGHT / 2, 0],
          ),
        },
      ],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: expanded.get() ? "auto" : "none",
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded.get() ? 0 : 1, {
        duration: expanded.get() ? 50 : 250,
        easing: Easing.inOut(Easing.ease),
      }),
      transform: [{ scale: applySpring(expanded.get() ? 4 : 1) }],
    };
  });

  const historyAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded.get() ? 1 : 0, {
        duration: expanded.get() ? 200 : 150,
        easing: Easing.inOut(Easing.ease),
      }),
      pointerEvents: expanded.get() ? "auto" : "none",
    };
  });

  useAnimatedReaction(
    () => expanded.get(),
    () => {
      expanded_animated.set(true);
    },
  );

  return (
    <>
      <View style={{ flex: 1, paddingTop: isAndroid ? 52 : 0 }}>
        {children}
      </View>
      <AnimatedPressable
        style={[StyleSheet.absoluteFill, overlayStyle]}
        onPressIn={() => {
          expanded.set(false);
        }}
      />
      <AnimatedPressable
        style={[
          styles.backButton,
          {
            outlineColor: "#ffffff20",
            backgroundColor: isAndroid ? bg : "transparent",
            top: top / 2 + 31,
            borderRadius: size / 2 + SPACING,
          },
          animatedStyle,
        ]}
        onPressIn={() => {
          scale.set(1.2);
        }}
        onPressOut={() => {
          scale.set(1);
        }}
        onPress={() => {
          if (!router.canGoBack() || expanded.get()) return;
          router.back();

          // router.back();
        }}
        onLongPress={() => {
          expanded.set(!expanded.get());
          scale.set(1);
        }}
        delayLongPress={400}
      >
        {!isAndroid && (
          <AnimatedBlurView
            style={[
              styles.blurUnderlay,
              {
                backgroundColor: bg,
              },
            ]}
            intensity={blurIntensity}
          />
        )}
        <Animated.View style={[styles.icon, iconAnimatedStyle]}>
          <ThemedTextWrapper>
            <ChevronLeft size={30} style={{ marginLeft: -2 }} />
          </ThemedTextWrapper>
        </Animated.View>
        {!isAndroid && (
          <AnimatedBlurView
            style={StyleSheet.absoluteFill}
            intensity={iconBlurIntensity}
          />
        )}
        <Animated.View style={[styles.history, historyAnimatedStyle]}>
          {history.map((item, index) => {
            const pathSegment = item.path.split("/").slice(-1)[0] || "index";
            const labelSegment = item.label || "index";

            console.log(labelSegment);

            const title =
              titles?.[item.path] ||
              titles?.[labelSegment] ||
              titles?.[pathSegment] ||
              (usePathTitles ? pathSegment : labelSegment);
            if (index === history.length - 1) return null;

            return (
              <Pressable
                key={index}
                style={styles.historyItem}
                onPress={() => {
                  const stepsBack = history.length - 1 - index;
                  for (let i = 0; i < stepsBack; i++) {
                    router.back();
                  }
                  expanded.set(false);
                }}
              >
                <ThemedText>{title}</ThemedText>
              </Pressable>
            );
          })}
        </Animated.View>
      </AnimatedPressable>
    </>
  );
};

export default CustomBack;

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    // top: 70,
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
    width: EXPANDED_WIDTH - SPACING * 2,
    marginHorizontal: SPACING,
    justifyContent: "center",
    // backgroundColor: "#ffffff10",
    paddingHorizontal: SPACING * 6,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
  },
});
