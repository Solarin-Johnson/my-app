import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Feedback } from "@/functions";
import { BlurView } from "expo-blur";
import { Download, Pause, Play, StopCircle } from "lucide-react-native";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import Button from "../ui/Button";
import { Image } from "expo-image";
import { RadialProgress } from "../ui/radial-progress";
import { FontAwesome6 } from "@expo/vector-icons";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const COLLAPSED_WIDTH = 194;
const EXPANDED_HEIGHT = 80;
const COLLAPSED_HEIGHT = 40;
const SPACE = 20;
const COLLAPSED_SPACE = 8;
const EXPANDED_SPACE = 18;

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
  const { width } = useWindowDimensions();
  const EXPANDED_WIDTH = width - SPACE * 2;
  const downloadProgress = useSharedValue(10);

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
      pointerEvents: presented.value ? "auto" : "none",
    };
  });

  return (
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
                size={30}
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
            <Pause color={"white"} size={32} strokeWidth={1.8} />
            <StopCircle color={"white"} size={32} strokeWidth={1.8} />
          </View>
          <View style={styles.cluster}>
            <ThemedText style={styles.toastText} colorName="orange">
              Download
            </ThemedText>
            <ThemedText style={styles.toastTextLarge} colorName="orange">
              10%
            </ThemedText>
          </View>
        </Inner>
      </AnimatedPressable>
    </View>
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
    return {
      opacity: applySpring((type === "collapsed") === !expanded.value ? 1 : 0),
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
      <AnimatedBlurView intensity={intensity} style={styles.blur} />
    </Animated.View>
  );
};

const InnerLeft = ({}) => {
  return <View></View>;
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
    fontSize: 28,
  },
  inner: {
    flexDirection: "row",
    ...StyleSheet.absoluteFillObject,
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
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
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
});
