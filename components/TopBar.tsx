import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Plus, Share, X } from "lucide-react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { ReloadIcon } from "./icons";

const BAR_HEIGHT = 40;
const ICON_SIZE = 70;
const LABEL_HEIGHT = 32;
const TABS_COUNT = 3;
export const DRAG_THRESHOLD = 50;
const address = "expo.dev";

const SPRING_CONFIG = {
  damping: 30,
  stiffness: 400,
  mass: 0.6,
};

interface TopBarProps {
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  pressed: SharedValue<boolean>;
}

export default function TopBar({
  translateX,
  translateY,
  pressed,
}: TopBarProps) {
  const text = useThemeColor("text");
  const bg = useThemeColor("background");

  const barAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, BAR_HEIGHT], [1, 0], "clamp"),
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    height: BAR_HEIGHT + translateY.value,
  }));

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={{ height: BAR_HEIGHT }}>
        <Animated.View style={[styles.wrapper, animatedStyle]}>
          <Actions
            translateX={translateX}
            translateY={translateY}
            pressed={pressed}
          />
          <Animated.View
            style={[
              styles.barWrapper,
              { backgroundColor: bg },
              barAnimatedStyle,
            ]}
          >
            <Animated.View
              style={[styles.bar, { backgroundColor: "#ffffff40" }]}
            >
              <ThemedText
                type="defaultSemiBold"
                style={{
                  fontSize: 16,
                }}
              >
                {address}
              </ThemedText>
              <Share
                color={text}
                style={styles.floatIcon}
                size={20}
                strokeWidth={2.2}
              />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const getInterpolate = (
  value: number,
  outputRange: [number, number],
  inputRange?: [number, number]
) => {
  "worklet";
  return interpolate(
    value,
    inputRange || [0, DRAG_THRESHOLD + BAR_HEIGHT],
    outputRange,
    Extrapolation.CLAMP
  );
};

const Actions = ({ translateX, translateY, pressed }: TopBarProps) => {
  const text = useThemeColor("text");

  const iconProps = {
    color: text,
    size: 31,
    strokeWidth: 2.3,
    weight: 2.3,
  };

  const actionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [DRAG_THRESHOLD / 2, DRAG_THRESHOLD + BAR_HEIGHT / 2],
      [0, 1],
      "clamp"
    ),
  }));

  const iconRotate = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${getInterpolate(translateY.value, [-90, 45])}deg`,
      },
    ],
  }));

  const getIconStyle = (direction: "left" | "right") =>
    useAnimatedStyle(() => {
      const offset = direction === "left" ? ICON_SIZE : -ICON_SIZE;
      return {
        transform: [
          {
            translateX: getInterpolate(translateY.value, [offset, 0]),
          },
        ],
        opacity: getInterpolate(translateY.value, [0, 1]),
      };
    });

  const iconLeft = getIconStyle("left");
  const iconRight = getIconStyle("right");

  const prevIndex = useSharedValue(1);
  const thresholdConfirmed = useDerivedValue(() => {
    return translateY.value > DRAG_THRESHOLD;
  });

  const activeIndex = useDerivedValue(() => {
    const step = ICON_SIZE + BAR_HEIGHT;
    const raw = translateX.value / step + 1;

    const base = Math.floor(raw);
    const decimal = raw - base;

    let nextIndex = prevIndex.value;

    if (raw > prevIndex.value) {
      // Moving forward
      if (decimal >= 0.9) {
        nextIndex = base + 1;
      }
    } else if (raw < prevIndex.value) {
      // Moving backward
      if (decimal <= 0.1) {
        nextIndex = base;
      }
    }

    nextIndex = Math.max(0, Math.min(2, nextIndex));
    prevIndex.value = nextIndex;

    return thresholdConfirmed.value ? nextIndex : 1;
  });

  const stretchProgress = useDerivedValue(() => {
    const step = ICON_SIZE + BAR_HEIGHT;
    const raw = translateX.value / step + 1;

    const current = prevIndex.value;
    const progress = raw - current;

    if (
      (prevIndex.value === 0 && progress < 0) ||
      (prevIndex.value === TABS_COUNT - 1 && progress > 0)
    ) {
      return 0;
    }
    return thresholdConfirmed.value ? Math.max(-1, Math.min(1, progress)) : 0;
  });

  const confirmedAction = useSharedValue(false);

  useDerivedValue(() => {
    if (!pressed.value) {
      const threshold = DRAG_THRESHOLD + BAR_HEIGHT / 2;
      if (translateY.value > threshold) {
        confirmedAction.value = true;
      }
    } else {
      confirmedAction.value = false;
    }
  });

  const actionItemProps = {
    translateY,
    activeIndex,
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const isPressed = pressed.value;
    const scale = Math.min(20, 12 + (translateY.value - DRAG_THRESHOLD) / 5);

    return {
      transform: [
        {
          scale: !confirmedAction.value
            ? getInterpolate(translateY.value, [0, 1])
            : withSpring(scale, {
                mass: 0.4,
                damping: 24,
              }),
        },
        {
          translateX: withSpring(
            isPressed
              ? Math.max(-1, Math.min(1, activeIndex.value - 1)) *
                  (ICON_SIZE + BAR_HEIGHT) +
                  stretchProgress.value * (ICON_SIZE / 4)
              : 0,
            SPRING_CONFIG
          ),
        },
      ],
      opacity: getInterpolate(translateY.value, [0, 1]),
    };
  });

  const indicatorWrapperStyle = useAnimatedStyle(() => {
    return {};
  });

  return (
    <Animated.View style={[styles.actionWrapper, actionAnimatedStyle]}>
      <Animated.View style={[styles.indicatorWrapper, indicatorWrapperStyle]}>
        <Animated.View
          style={[styles.iconStyle, styles.indicator, indicatorStyle]}
        />
      </Animated.View>
      <ActionItem
        icon={
          <Animated.View style={[styles.iconStyle, iconLeft]}>
            <Plus {...iconProps} />
          </Animated.View>
        }
        label="New Tab"
        {...actionItemProps}
        index={0}
      />
      <ActionItem
        icon={
          <Animated.View style={[styles.iconStyle, iconRotate]}>
            <ReloadIcon {...iconProps} />
          </Animated.View>
        }
        label="Refresh"
        {...actionItemProps}
        index={1}
      />
      <ActionItem
        icon={
          <Animated.View style={[styles.iconStyle, iconRight]}>
            <X {...iconProps} />
          </Animated.View>
        }
        label="Close"
        {...actionItemProps}
        index={2}
      />
    </Animated.View>
  );
};

const ActionItem = ({
  icon,
  label,
  activeIndex,
  index,
  translateY,
}: {
  icon: ReactNode;
  label: string;
  activeIndex: SharedValue<number>;
  index: number;
  translateY: SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withSpring(activeIndex.value === index ? 1 : 0, SPRING_CONFIG),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: getInterpolate(
      translateY.value,
      [0, 1],
      [ICON_SIZE, DRAG_THRESHOLD + BAR_HEIGHT]
    ),
  }));

  return (
    <View style={styles.actionItem}>
      {icon}
      <Animated.View style={labelStyle}>
        <Animated.View style={animatedStyle}>
          <ThemedText type="defaultSemiBold" style={styles.actionLabel}>
            {label}
          </ThemedText>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  wrapper: {
    position: "absolute",
    top: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  bar: {
    height: BAR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  barWrapper: {
    borderRadius: BAR_HEIGHT / 2,
    borderCurve: "continuous",
    overflow: "hidden",
    width: "100%",
    alignSelf: "flex-end",
  },
  floatIcon: {
    position: "absolute",
    right: 12,
  },
  actionLabel: {
    fontSize: 12,
    lineHeight: LABEL_HEIGHT,
  },
  actionItem: {
    width: ICON_SIZE,
    alignItems: "center",
  },
  actionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    alignSelf: "center",
    gap: BAR_HEIGHT,
  },
  iconStyle: {
    width: ICON_SIZE,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorWrapper: {
    position: "absolute",
    marginTop: -LABEL_HEIGHT,
  },
  indicator: {
    borderRadius: ICON_SIZE / 2,
    backgroundColor: "#ffffff20",
  },
});
