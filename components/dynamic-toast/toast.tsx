import {
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Platform,
} from "react-native";
import React, { Children } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Feedback } from "@/functions";
import { BlurView } from "expo-blur";
import { ThemedTextProps, ThemedTextWrapper } from "../ThemedText";
import PressableBounce from "../PresableBounce";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  COLLAPSED_WIDTH,
  COLLAPSED_SPACE,
  COLLAPSED_HEIGHT,
  EXPANDED_HEIGHT,
  EXPANDED_SPACE,
  SPACE,
  useDynamicToast,
  SPRING_CONFIG_BOUNCE,
  SPRING_CONFIG_SLOW,
  applySpring,
} from "./provider";
import { Colors } from "@/constants/Colors";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ToastProps = {
  children?: React.ReactNode;
};

const isIOS = Platform.OS === "ios";
const isWeb = Platform.OS === "web";

export function Toast({ children }: ToastProps) {
  const { expanded, pressed, presented } = useDynamicToast();
  const { width } = useWindowDimensions();
  const EXPANDED_WIDTH = Math.min(width - SPACE * 2, 430);

  const applyBounceSpring = (toValue: number, callback?: () => void) => {
    "worklet";
    return withSpring(
      toValue,
      presented.value ? SPRING_CONFIG_BOUNCE : SPRING_CONFIG_SLOW,
      callback,
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    const targetWidth = expanded.value ? EXPANDED_WIDTH : COLLAPSED_WIDTH;
    const targetHeight = expanded.value ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
    const targetScale = !presented.value
      ? 0.2
      : pressed.value
        ? expanded.value
          ? 1.05
          : 1.1
        : 1;
    const targetTranslateY = presented.value ? 0 : 2 * (targetHeight + SPACE);

    return {
      width: applySpring(targetWidth),
      height: applySpring(targetHeight),
      transform: [
        { scale: applySpring(targetScale) },
        { translateY: applyBounceSpring(targetTranslateY) },
      ],
      opacity: applySpring(presented.value ? 1 : 0),
      pointerEvents: presented.value || !expanded.value ? "auto" : "box-none",
    };
  });

  return (
    <>
      <View style={styles.wrapper}>
        {/* <Button
          title="Toggle Toast"
          onPress={() => {
            presented.value = !presented.value;
          }}
        /> */}
        <AnimatedPressable
          onLongPress={() => {
            if (expanded.value) return;
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
          {children}
        </AnimatedPressable>
      </View>
    </>
  );
}

export type innerType = {
  expanded: SharedValue<boolean>;
  type?: "collapsed" | "expanded";
  hide?: SharedValue<boolean>;
  children?: React.ReactNode;
};

export const Inner = ({
  expanded,
  type = "expanded",
  hide,
  children,
}: innerType) => {
  const intensity = useDerivedValue<number | undefined>(() => {
    const isCollapsed = type === "collapsed";
    return applySpring(expanded.value === isCollapsed ? 30 : 0);
  });

  const animatedStyle = useAnimatedStyle(() => {
    if (hide?.value) {
      return {
        opacity: withTiming(0, { duration: 300 }),
        pointerEvents: "none",
      };
    }

    const isExpanded = type === "expanded";
    const shouldShow = isExpanded === expanded.value;

    return {
      opacity: withDelay(
        shouldShow && isExpanded ? 100 : 0,
        withTiming(shouldShow ? 1 : 0, {
          duration:
            shouldShow && isExpanded ? 200 : !isIOS && isExpanded ? 200 : 300,
        }),
      ),
      pointerEvents: shouldShow ? "auto" : "none",
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
      {isIOS && (
        <AnimatedBlurView
          intensity={intensity}
          style={styles.blur}
          pointerEvents="none"
        />
      )}
    </Animated.View>
  );
};

export const ButtonWrapper = ({
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
    zIndex: 1000,
    userSelect: "none",
  },
  toastContainer: {
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
    borderColor: Colors.dark.orange + "80",
    transformOrigin: "bottom",
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
  button: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    borderRadius: "50%",
  },
});
