import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";
import React, { Children, useEffect } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Feedback } from "@/functions";
import { BlurView } from "expo-blur";
import { Download, Pause, Play, StopCircle, X } from "lucide-react-native";
import { ThemedText, ThemedTextProps, ThemedTextWrapper } from "../ThemedText";
import Button from "../ui/Button";
import { Image } from "expo-image";
import { RadialProgress } from "../ui/radial-progress";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { AnimatedText } from "../ui/animated-text";
import PressableBounce from "../PresableBounce";
import { useThemeColor } from "@/hooks/useThemeColor";
import { withPause } from "react-native-redash";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

const COLLAPSED_WIDTH = 194;
const EXPANDED_HEIGHT = 75;
const COLLAPSED_HEIGHT = 40;
const SPACE = 20;
const COLLAPSED_SPACE = 8;
const EXPANDED_SPACE = 12;

const SPRING_CONFIG = {
  stiffness: 210,
  damping: 24,
  mass: 1,
};

const SPRING_CONFIG_SLOW = {
  stiffness: 180,
  damping: 22,
  mass: 1,
};

const SPRING_CONFIG_BOUNCE = {
  stiffness: 200,
  damping: 20,
  mass: 1,
  restDisplacementThreshold: 0.000001,
  restSpeedThreshold: 0.000001,
};

const applySpring = (toValue: number) => {
  "worklet";
  return withSpring(toValue, SPRING_CONFIG);
};

export default function DynamicToast() {
  const expanded = useSharedValue(false);
  const pressed = useSharedValue(false);
  const presented = useSharedValue(true);
  const paused = useSharedValue(false);
  const { width } = useWindowDimensions();
  const EXPANDED_WIDTH = width - SPACE * 2;
  const downloadProgress = useSharedValue(0);

  const applyBounceSpring = (toValue: number) => {
    "worklet";
    return withSpring(
      toValue,
      presented.value ? SPRING_CONFIG_BOUNCE : SPRING_CONFIG_SLOW,
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: applySpring(expanded.value ? EXPANDED_WIDTH : COLLAPSED_WIDTH),
      height: applySpring(expanded.value ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT),
      transform: [
        {
          scale: applySpring(!presented.value ? 0.2 : pressed.value ? 1.1 : 1),
        },
        {
          translateY: applyBounceSpring(
            presented.value
              ? 0
              : 2 *
                  (expanded.value ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT + SPACE),
          ),
        },
      ],
      opacity: applySpring(presented.value ? 1 : 0),
      pointerEvents: presented.value || !expanded.value ? "box" : "box-none",
    };
  });

  const percentage = useDerivedValue(() => {
    return `${Math.round(downloadProgress.value)}%`;
  });

  useEffect(() => {
    downloadProgress.value = withPause(
      withTiming(100, { duration: 10000 }),
      paused,
    );
  }, []);

  const togglePlayPause = () => {
    paused.value = !paused.value;
  };

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: expanded.value ? "auto" : "none",
    };
  });

  const createIconAnimatedStyle = (
    isVisible: SharedValue<boolean>,
    scale: number = 0.5,
  ) =>
    useAnimatedStyle(() => {
      const shouldShow = isVisible.value;
      return {
        opacity: withTiming(shouldShow ? 1 : 0, {
          duration: shouldShow ? 300 : 50,
        }),
        transform: [
          {
            scale: withTiming(shouldShow ? 1 : scale, {
              duration: shouldShow ? 300 : 100,
            }),
          },
        ],
      };
    });

  const playing = useDerivedValue(() => !paused.value);

  const playIconAnimatedStyle = createIconAnimatedStyle(paused, 0.5);
  const pauseIconAnimatedStyle = createIconAnimatedStyle(playing, 0.5);

  return (
    <>
      <AnimatedPressable
        style={[StyleSheet.absoluteFill, overlayAnimatedStyle]}
        onPressIn={() => {
          expanded.value = false;
        }}
      />
      <View style={styles.wrapper}>
        {/* <Button
        title="Toggle Toast"
        onPress={() => {
          presented.value = !presented.value;
        }}
      /> */}
        <AnimatedPressable
          onLongPress={() => {
            pressed.value = false;
            expanded.value = !expanded.value;
            Feedback.light();
          }}
          onPressIn={() => {
            pressed.value = true;
          }}
          onPressOut={() => {
            pressed.value = false;
          }}
          delayLongPress={200}
          style={[styles.toastContainer, animatedStyle]}
        >
          <Inner expanded={expanded} type="collapsed">
            <Image
              source={require("@/assets/images/dp.png")}
              style={styles.collapsedBlock}
            />
            <View>
              <View style={styles.float}>
                <ThemedTextWrapper colorName="orange">
                  <FontAwesome6 name="arrow-down" size={13} />
                </ThemedTextWrapper>
              </View>
              <ThemedTextWrapper colorName="orange">
                <RadialProgress
                  progress={downloadProgress}
                  weight={5}
                  size={28}
                  fadeOpacity={0.32}
                />
              </ThemedTextWrapper>
            </View>
            {/* <ThemedText style={styles.toastText} type="semiBold">
            10%
          </ThemedText> */}
          </Inner>
          <Inner expanded={expanded} type="expanded">
            <View style={styles.cluster}>
              {/* <Image
              source={require("@/assets/images/dp.png")}
              style={styles.expandedBlock}
            /> */}
              <ButtonWrapper color="orange" onPress={togglePlayPause}>
                <Animated.View
                  style={[styles.buttonIcon, playIconAnimatedStyle]}
                >
                  <ThemedTextWrapper colorName="orange">
                    <Ionicons name="play" size={30} style={{ marginLeft: 2 }} />
                  </ThemedTextWrapper>
                </Animated.View>
                <Animated.View
                  style={[styles.buttonIcon, pauseIconAnimatedStyle]}
                >
                  <ThemedTextWrapper colorName="orange">
                    <Ionicons name="pause" size={30} />
                  </ThemedTextWrapper>
                </Animated.View>
              </ButtonWrapper>
              <ButtonWrapper
                fadeOpacity={0.2}
                onPress={() => {
                  expanded.value = false;
                }}
              >
                <X color={"white"} size={30} strokeWidth={2.2} />
              </ButtonWrapper>
            </View>
            <Animated.View style={[styles.cluster, { gap: 4 }]}>
              {/* <ThemedText
                style={[styles.toastText, styles.numberDesc]}
                colorName="orange"
              >
                Download
              </ThemedText> */}
              <ThemedTextWrapper
                style={[styles.toastTextLarge, styles.numberText]}
                colorName="orange"
              >
                <AnimatedText text={percentage} />
              </ThemedTextWrapper>
            </Animated.View>
          </Inner>
        </AnimatedPressable>
      </View>
    </>
  );
}

type innerType = {
  expanded: SharedValue<boolean>;
  type?: "collapsed" | "expanded";
  children?: React.ReactNode;
};

const Inner = ({ expanded, type = "collapsed", children }: innerType) => {
  const intensity = useDerivedValue<number | undefined>(() => {
    const isCollapsed = type === "collapsed";
    return applySpring(expanded.value === isCollapsed ? 30 : 0);
  });

  const animatedStyle = useAnimatedStyle(() => {
    const slower = (type === "collapsed") !== expanded.value;
    const exp = type === "expanded" && expanded.value;
    return {
      opacity: withDelay(
        exp ? 100 : 0,
        withTiming(slower ? 1 : 0, {
          duration: !exp ? 300 : 200,
        }),
      ),
    };
  });
  return (
    <Animated.View
      style={[
        styles.inner,
        type === "collapsed" ? styles.innerCollapsed : styles.innerExpanded,
        animatedStyle,
      ]}
    >
      {children}
      <AnimatedBlurView
        intensity={intensity}
        style={styles.blur}
        pointerEvents="none"
      />
    </Animated.View>
  );
};

const ButtonWrapper = ({
  children,
  color = "white",
  fadeOpacity = 0.35,
  onPress,
}: {
  children: React.ReactNode;
  color?: ThemedTextProps["colorName"];
  fadeOpacity?: number;
  onPress?: () => void;
}) => {
  const bg = useThemeColor(color);
  return (
    <PressableBounce
      style={[
        styles.button,
        {
          backgroundColor: `${bg}${Math.floor(fadeOpacity * 255).toString(16)}`,
        },
      ]}
      onPress={(e) => {
        e.stopPropagation();
        onPress?.();
      }}
    >
      {Children.map(children, (child) =>
        React.isValidElement(child) ? (
          <ThemedTextWrapper colorName={color}>{child}</ThemedTextWrapper>
        ) : null,
      )}
    </PressableBounce>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: SPACE,
    left: SPACE,
    right: SPACE,
    alignItems: "center",
    gap: 24,
  },
  toastContainer: {
    // flex: 1,
    width: COLLAPSED_WIDTH,
    height: COLLAPSED_HEIGHT,
    borderRadius: 45,
    // borderTopRightRadius: 0,
    // borderTopLeftRadius: 0,
    borderCurve: "continuous",
    backgroundColor: "#000",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#88888890",
    transformOrigin: "bottom",
  },
  toastText: {
    fontSize: 15,
  },
  toastTextLarge: {
    fontSize: 36,
  },
  inner: {
    flexDirection: "row",
    ...StyleSheet.absoluteFillObject,
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    alignItems: "center",
    justifyContent: "space-between",
  },
  innerExpanded: {
    height: EXPANDED_HEIGHT,
    paddingHorizontal: EXPANDED_SPACE,
  },
  innerCollapsed: {
    height: COLLAPSED_HEIGHT,
    paddingHorizontal: COLLAPSED_SPACE,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  cluster: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8,
  },
  collapsedBlock: {
    width: COLLAPSED_SPACE * 3,
    borderCurve: "continuous",
    aspectRatio: 1,
    borderRadius: 6,
  },
  expandedBlock: {
    width: EXPANDED_SPACE * 3,
    aspectRatio: 1,
    borderRadius: 12,
  },
  float: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    paddingRight: 8,
    width: 150,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  numberDesc: {
    lineHeight: 32,
  },
  button: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    borderRadius: "50%",
  },
  buttonIcon: {
    position: "absolute",
  },
});
