import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  useWindowDimensions,
  BackHandler,
  TextInput,
  ScrollView,
} from "react-native";
import React, { memo, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ClockFading, LucideProps, Search, Star, X } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import {
  KeyboardAvoidingView,
  KeyboardGestureArea,
  useKeyboardHandler,
} from "react-native-keyboard-controller";

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
        style={[styles.barIcon, { backgroundColor: text + "12" }, style]}
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
  const { height: windowHeight } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const bg = useThemeColor("barColor");
  const text = useThemeColor("text");
  const input = useSharedValue("");
  const inputRef = useRef<TextInput>(null);
  const progress = useSharedValue(0);
  const height = useSharedValue(0);

  useEffect(() => {
    const backHandler = () =>
      isVisible.value && ((isVisible.value = false), true);

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backHandler
    );
    return () => subscription.remove();
  }, []);

  const focus = () => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  };

  const blurInput = () => {
    if (inputRef.current) {
      inputRef.current?.blur();
      inputRef.current?.clear();
      input.value = "";
    }
  };

  useAnimatedReaction(
    () => isVisible.value,
    (isVisible) => {
      if (isVisible) {
        runOnJS(focus)();
      } else {
        runOnJS(blurInput)();
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: top + 40,
      bottom: bottom + 40 + height.value,
      backgroundColor: bg,
      transform: [
        {
          translateY: withSpring(
            isVisible.value ? 0 : windowHeight,
            SPRING_CONFIG
          ),
        },
        {
          scale: withSpring(isVisible.value ? 1 : 0.8, {
            ...SPRING_CONFIG,
            stiffness: 240,
          }),
        },
      ],
    };
  });

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        progress.value = e.progress;
        height.value = e.height;
      },

      onInteractive: (e) => {
        "worklet";
        progress.value = e.progress;
        height.value = e.height;
      },
    },

    []
  );

  return (
    <Animated.View style={[styles.searchWindow, animatedStyle]}>
      <SearchInput input={input} inputRef={inputRef} isVisible={isVisible} />
      <KeyboardGestureArea interpolator="ios" style={{ flex: 1 }} offset={80}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ padding: 8, gap: 8 }}
          showsVerticalScrollIndicator={false}
          decelerationRate={0.99}
        >
          {Array.from({ length: 15 }).map((_, index) => (
            <Cluster key={index} />
          ))}
        </ScrollView>
      </KeyboardGestureArea>
    </Animated.View>
  );
};

const SearchInput = memo(
  ({
    input,
    inputRef,
    isVisible,
  }: {
    input: SharedValue<string>;
    inputRef: React.RefObject<TextInput | null>;
    isVisible: SharedValue<boolean>;
  }) => {
    const text = useThemeColor("text");

    const handleClearOrClose = () => {
      if (input.value.length > 0) {
        inputRef.current?.clear();
        input.value = "";
      } else {
        isVisible.value = false;
      }
    };

    return (
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Search for people and places"
          placeholderTextColor={`${text}80`}
          style={[
            styles.texInput,
            {
              color: text,
            },
          ]}
          ref={inputRef}
          selectionColor={text + "90"}
          onChangeText={(value) => {
            input.value = value;
          }}
        />
        <Pressable
          onPress={handleClearOrClose}
          style={styles.button}
          hitSlop={8}
        >
          <X size={15} strokeWidth={2.4} color="#ffffff" />
        </Pressable>
      </View>
    );
  }
);

const Cluster = () => {
  const text = useThemeColor("text");
  const bg = useThemeColor("background");

  const itemStyle = { backgroundColor: text + "14" };

  return (
    <View style={styles.cluster}>
      <View style={[styles.clusterCircle, itemStyle]} />
      <View style={[styles.clusterBar, itemStyle]} />
    </View>
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
    borderCurve: "continuous",
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
    alignSelf: "center",
    borderRadius: 16,
    borderCurve: "continuous",
    boxShadow: "0 0 20px #00000010",
    borderWidth: 1,
    borderColor: "#ffffff0F",
    overflow: "hidden",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#88888830",
    height: 52,
  },
  scrollView: {
    flex: 1,
  },
  button: {
    marginRight: 12,
    padding: 4,
    borderRadius: 24,
    borderCurve: "continuous",
    backgroundColor: "#88888888",
  },
  texInput: {
    fontSize: 15,
    paddingHorizontal: 12,
    height: "100%",
    flex: 1,
    fontFamily: "InterMedium",
  },
  cluster: {
    height: 54,
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },
  clusterCircle: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: "50%",
  },
  clusterBar: {
    height: "100%",
    flex: 1,
    borderRadius: 8,
    backgroundColor: "blue",
    borderCurve: "continuous",
  },
});
