import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  useWindowDimensions,
  BackHandler,
} from "react-native";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ClockFading, LucideProps, Search, Star } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SPRING_CONFIG = {
  damping: 18,
  stiffness: 180,
  mass: 0.5,
};
const ANIMATION_DELAY = 180;

export default function BottomBar() {
  const searchExpanded = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    const isVisible = searchExpanded.value;
    return {
      top: withDelay(
        isVisible ? 0 : ANIMATION_DELAY,
        withTiming(`${isVisible ? 0 : 100}%`, { duration: 0 })
      ),
    };
  });

  return (
    <>
      <BarIcons searchExpanded={searchExpanded} />
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={{ flex: 1 }}>
          <Underlay isVisible={searchExpanded} />
          <SearchWindow isVisible={searchExpanded} />
        </View>
      </Animated.View>
    </>
  );
}

const BarIcons = ({
  searchExpanded,
}: {
  searchExpanded: SharedValue<boolean>;
}) => {
  const text = useThemeColor("text");
  const { bottom } = useSafeAreaInsets();

  const iconProps: LucideProps = {
    color: text,
    size: 24,
    strokeWidth: 1.8,
  };

  const animatedStyle = useAnimatedStyle(() => {
    const visibile = !searchExpanded.value;
    const delay = visibile ? ANIMATION_DELAY : 0;
    return {
      transform: [
        {
          translateY: withDelay(
            delay,
            withSpring(`${visibile ? 0 : 80}%`, SPRING_CONFIG)
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        styles.bar,
        { paddingBottom: bottom + 24 },
        animatedStyle,
      ]}
    >
      <Animated.View style={styles.barIcons}>
        <BarIcon>
          <ClockFading {...iconProps} />
        </BarIcon>
        <BarIcon
          onPress={() => {
            searchExpanded.value = true;
          }}
          style={{ aspectRatio: 5 / 2 }}
        >
          <Search {...iconProps} size={19} />
          <ThemedText type="subtitle">Search</ThemedText>
        </BarIcon>
        <BarIcon>
          <Star {...iconProps} />
        </BarIcon>
      </Animated.View>
    </Animated.View>
  );
};

const BarIcon = ({
  onPress,
  children,
  style,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}) => {
  const text = useThemeColor("text");
  const bg = useThemeColor("background");
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(scale.value, SPRING_CONFIG),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.rounded,
        styles.frame,
        { backgroundColor: bg },
        animatedStyle,
      ]}
    >
      <Pressable
        onPressIn={() => {
          scale.value = 0.9;
        }}
        onPressOut={() => {
          scale.value = 1;
        }}
        style={[
          styles.barIcon,
          styles.rounded,
          { backgroundColor: text + "15" },
          style,
        ]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

const Underlay = ({
  onPress,
  isVisible,
}: {
  onPress?: () => void;
  isVisible: SharedValue<boolean>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isVisible.value ? 1 : 0, SPRING_CONFIG),
    };
  });

  return (
    <AnimatedPressable
      style={[styles.container, styles.underlay, animatedStyle]}
      onPress={() => {
        isVisible.value = false;
        if (onPress) {
          onPress();
        }
      }}
    />
  );
};

const SearchWindow = ({ isVisible }: { isVisible: SharedValue<boolean> }) => {
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const bg = useThemeColor("barColor");

  useEffect(() => {
    const backHandler = () =>
      isVisible.value && ((isVisible.value = false), true);

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backHandler
    );
    return () => subscription.remove();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: top + 40,
      bottom: bottom + 40,
      backgroundColor: bg,
      transform: [
        {
          translateY: withSpring(isVisible.value ? 0 : height, SPRING_CONFIG),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.searchWindow, animatedStyle]}>
      <Text>Search Window</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  bar: {
    paddingTop: 24,
    alignItems: "center",
  },
  barIcons: {
    flexDirection: "row",
    gap: 12,
    height: 72,
    padding: 8,
  },
  rounded: {
    borderRadius: 36,
    overflow: "hidden",
  },
  frame: {
    boxShadow: "-0.5px -0.5px 1px #ffffff30",
  },
  barIcon: {
    flexDirection: "row",
    gap: 8,
    height: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  underlay: {
    top: 0,
    backgroundColor: "#00000050",
  },
  searchWindow: {
    position: "absolute",
    width: "90%",
    // bottom: 0,
    alignSelf: "center",
    borderRadius: 16,
    padding: 16,
  },
});
