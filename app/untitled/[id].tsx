import React, { useRef } from "react";
import { router } from "expo-router";
import UntitledScreen from "@/components/untitled/screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import UntitledButton, {
  UntitledButtonWrapper,
} from "@/components/untitled/button";
import { UntitledCardLarge } from "@/components/untitled/card";
import {
  GestureDetector,
  useNativeGesture,
  usePanGesture,
} from "react-native-gesture-handler";
import Transition, {
  useScreenAnimation,
} from "react-native-screen-transitions";
import Animated, {
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
} from "react-native-reanimated";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import UntitledHeader from "@/components/untitled/header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RecordPage from "@/components/untitled/record";
import { StackedButton } from "@/components/stacked-button";
import { ThemedText } from "@/components/ThemedText";

const AnimatedThemedView = Animated.createAnimatedComponent(ThemedView);

const ScrollView = Transition.createTransitionAwareComponent(
  Animated.ScrollView,
);

const THRESHOLD = 200;
const PAGE_PEEK_HEIGHT = 54;

export default function Index() {
  const scrollRef = useRef(null);
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const screenAnimation = useScreenAnimation();

  const record = useSharedValue(false);
  const snapped = useSharedValue(false);
  const scrollY = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  const { height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();

  const activeOffsetX = useDerivedValue<number>(() => {
    return record.get() ? Number.MAX_VALUE : -5;
  });

  const activeOffsetY = useDerivedValue<number>(() => {
    if (scrollY.value > 0) {
      return Number.MAX_VALUE;
    }

    return 0;
  });

  const innerActiveOffset = useDerivedValue<number>(() => {
    console.log(scrollY.get());

    return scrollY.get() > 0 ? -5 : 0;
  });

  const isTransitioning = useDerivedValue(() => {
    return (
      screenAnimation.get().progress !== 1 &&
      !screenAnimation.get().active.animating
    );
  });

  const MAX_TRANSLATE = height - PAGE_PEEK_HEIGHT - bottom;

  const scrolledToTop = useDerivedValue(() => {
    return scrollY.value <= 0;
  });

  const nativeGesture = useNativeGesture({});

  const innerPanGesture = usePanGesture({
    // activeOffsetY: innerActiveOffset,
    activeOffsetX: [-5, Number.MAX_VALUE],
    block: nativeGesture,
    // requireToFail: nativeGesture,
    enabled: scrolledToTop,
  });

  const panGesture = usePanGesture({
    onBegin: () => {
      startY.set(translateY.get());
      isDragging.set(true);
    },
    onTouchesDown: () => {
      isDragging.set(true);
    },
    onTouchesMove: () => {
      isDragging.set(true);
    },
    onTouchesUp: () => {
      isDragging.set(false);
    },
    onTouchesCancel: () => {
      isDragging.set(false);
    },
    onUpdate: (e) => {
      const next = startY.get() + e.translationY;
      let clamped = Math.min(MAX_TRANSLATE, Math.max(0, next));
      clamped += e.velocityY * 0.01;
      translateY.set(Math.min(MAX_TRANSLATE, Math.max(0, clamped)));
    },
    onDeactivate: (e) => {
      const dir = translateY.get() - startY.get();
      const isDownwardSwipe = dir > 0 && translateY.get() > THRESHOLD;
      const isUpwardSwipe =
        dir < 0 && translateY.get() < MAX_TRANSLATE - THRESHOLD / 3;
      const isPastMidpoint = translateY.get() >= MAX_TRANSLATE / 2;

      snapped.set(!isUpwardSwipe && (isDownwardSwipe || isPastMidpoint));

      translateY.set(
        withDecay({
          velocity: e.velocityY * 0.005,
          deceleration: 0.999,
        }),
      );

      translateY.set(
        withSpring(
          isDownwardSwipe
            ? MAX_TRANSLATE
            : isUpwardSwipe
              ? 0
              : isPastMidpoint
                ? MAX_TRANSLATE
                : 0,
        ),
      );

      isDragging.set(false);
    },
    // failOffsetX: [-Number.MAX_VALUE, failOffset],
    activeOffsetX: activeOffsetX,
    activeOffsetY: activeOffsetY,
    simultaneousWith: innerPanGesture,
    enabled: scrolledToTop,
  });

  const underPanGesture = usePanGesture({});

  const pageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.get() }],
      borderRadius: translateY.get() > 0 ? 50 : 0,
    };
  });

  const pageInnerAnimatedStyle = useAnimatedStyle(() => {
    const interpolated = 1 - translateY.get() / MAX_TRANSLATE;
    return {
      opacity: snapped.get() ? interpolated : 1,
    };
  });

  const underAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: !isTransitioning.get() && translateY.get() > 0 ? 1 : 0,
    };
  });

  const bgAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: !isTransitioning.get() && translateY.get() > 0 ? 1 : 0,
      borderRadius: snapped.get()
        ? withSpring(32)
        : translateY.get() > 0
          ? 50
          : 0,
    };
  });

  const barAnimatedStyle = useAnimatedStyle(() => {
    const interpolated = translateY.get() / MAX_TRANSLATE;
    return {
      opacity: snapped.get() ? interpolated : 0,
    };
  });

  useAnimatedReaction(
    () => translateY.get(),
    (current) => {
      record.set(current > THRESHOLD);
    },
  );

  const scrollEnabled = useDerivedValue<boolean | undefined>(() => {
    return !record.get();
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <UntitledScreen barProps={{ type: "fill", hide: snapped }} hideHeader>
      <GestureDetector gesture={panGesture}>
        <View style={{ flex: 1 }} collapsable={false}>
          <GestureDetector gesture={underPanGesture}>
            <AnimatedThemedView
              style={[styles.under, underAnimatedStyle]}
              collapsable={false}
              colorName="untitledFg"
            >
              <RecordPage
                translateY={translateY}
                treshold={THRESHOLD}
                maxTranslateY={MAX_TRANSLATE}
                isDragging={isDragging}
                snapped={snapped}
              />
            </AnimatedThemedView>
          </GestureDetector>
          <Animated.View
            style={[styles.container, styles.page, pageAnimatedStyle]}
            collapsable={false}
          >
            <AnimatedThemedView
              style={[styles.bgStyle, bgAnimatedStyle]}
              colorName={"untitledBg"}
            />

            <Animated.View style={[styles.container, pageInnerAnimatedStyle]}>
              <UntitledHeader contentStyle={{ height: 50 }}>
                <Header />
              </UntitledHeader>
              <GestureDetector gesture={nativeGesture}>
                <ScrollView
                  ref={scrollRef}
                  style={{ flex: 1 }}
                  contentContainerStyle={{ flexGrow: 1 }}
                  scrollEnabled={scrollEnabled}
                  onScrollBeginDrag={() => {
                    currentIndex.set(0);
                  }}
                  onScroll={scrollHandler}
                  scrollEventThrottle={16}
                  showsVerticalScrollIndicator={false}
                  contentInset={{ top: 0, bottom: 125 }}
                >
                  <GestureDetector gesture={innerPanGesture}>
                    <View style={{ flexGrow: 1 }} collapsable={false}>
                      <UntitledCardLarge />
                      <StackedButton.Provider
                        currentIndex={currentIndex}
                        itemStyles={{
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 999,
                          alignItems: "center",
                        }}
                        gap={8}
                      >
                        <StackedButton.Container
                          style={{ width: "100%", padding: 16 }}
                        >
                          <StackedButton.Item>
                            <ThemedText type="regular">
                              New Recording
                            </ThemedText>
                          </StackedButton.Item>
                          <StackedButton.Item
                            onPress={() => {
                              console.log("Pressed");
                            }}
                          >
                            <ThemedText type="regular">
                              New Recording
                            </ThemedText>
                          </StackedButton.Item>
                          {/* <StackedButton.Item>
                            <ThemedText type="regular">
                              New Recording
                            </ThemedText>
                          </StackedButton.Item> */}
                        </StackedButton.Container>
                      </StackedButton.Provider>
                    </View>
                  </GestureDetector>
                </ScrollView>
              </GestureDetector>
            </Animated.View>
            <Animated.View style={[styles.bar, barAnimatedStyle]}>
              <ThemedView style={styles.barIcon} colorName="text" />
            </Animated.View>
          </Animated.View>
        </View>
      </GestureDetector>
    </UntitledScreen>
  );
}

const Header = () => {
  const goBack = () => {
    router.back();
  };
  return (
    <>
      <UntitledButtonWrapper>
        <UntitledButton onPress={goBack}>
          <Ionicons name="chevron-back" size={22} />
        </UntitledButton>
      </UntitledButtonWrapper>
      <UntitledButtonWrapper>
        <UntitledButton>
          <Ionicons name="link" size={19} />
        </UntitledButton>
        <UntitledButton>
          <Ionicons name="search" size={19} />
        </UntitledButton>
        <UntitledButton>
          <Ionicons name="ellipsis-horizontal-sharp" size={19} />
        </UntitledButton>
      </UntitledButtonWrapper>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    borderCurve: "continuous",
  },
  under: {
    ...StyleSheet.absoluteFill,
    experimental_backgroundImage:
      "linear-gradient(to bottom, transparent 0%, #00000010 100%)",
  },
  bgStyle: {
    ...StyleSheet.absoluteFill,
    boxShadow: "0px -30px 50px #00000010",
  },
  bar: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    // backgroundColor: "red",
    alignItems: "center",
  },
  barIcon: {
    height: 5,
    width: 40,
    borderRadius: 2.5,
    opacity: 0.1,
  },
});
