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
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import UntitledHeader from "@/components/untitled/header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RecordPage from "@/components/untitled/record";
import { RecordHandle } from "@/components/recorder/Record";
import { RecordingState } from "@/components/recorder/types";
import { scheduleOnRN } from "react-native-worklets";

const AnimatedThemedView = Animated.createAnimatedComponent(ThemedView);

const ScrollView = Transition.createTransitionAwareComponent(
  Animated.ScrollView,
  { isScrollable: true },
);

const THRESHOLD = 200;
const PAGE_PEEK_HEIGHT = 54;

export default function Index() {
  const scrollRef = useRef(null);
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const screenAnimation = useScreenAnimation();
  const recordRef = useRef<RecordHandle>(null!);
  const recordState = useSharedValue(RecordingState.Idle);
  const scheme = useColorScheme();

  const snapped = useSharedValue(false);
  const scrollY = useSharedValue(0);

  const scrolling = useSharedValue(false);

  const { height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();

  // const activeOffsetX = useSharedValue(0);
  const activeOffsetY = useSharedValue(0);

  const activeOffsetX = useDerivedValue<number>(() => {
    return translateY.get() <= THRESHOLD ? Number.MAX_VALUE : -Number.MAX_VALUE;
  });

  useDerivedValue(() => {
    console.log(
      "activeOffsetY",
      activeOffsetY.get(),
      "activeOffsetX",
      activeOffsetX.get(),
    );
    activeOffsetY.set(scrollY.get() > 0 ? Number.MAX_VALUE : Number.MAX_VALUE);
  });

  const isTransitioning = useDerivedValue(() => {
    return (
      screenAnimation.get().progress !== 1 &&
      !screenAnimation.get().active.animating
    );
  });

  const MAX_TRANSLATE = height - PAGE_PEEK_HEIGHT - bottom;

  const scrolledToTop = useDerivedValue(() => {
    return scrollY.get() <= 0;
  });

  const startRecording = async () => {
    await recordRef.current?.start();
    translateY.set(withSpring(MAX_TRANSLATE));
    snapped.set(true);
  };

  const stopRecording = async () => {
    if (recordRef.current?.getState() === RecordingState.Idle) return;
    await recordRef.current.stop();
    translateY.set(withSpring(0));
    snapped.set(false);
  };

  const pauseRecording = () => {
    recordRef.current?.pause();
  };

  const resumeRecording = () => {
    recordRef.current?.resume();
  };

  const toggleRecording = () => {
    const state = recordRef.current?.getState();
    state === RecordingState.Paused ? resumeRecording() : pauseRecording();
  };

  const restartRecording = async () => {
    await recordRef.current?.stop();
    setTimeout(() => {
      recordRef.current?.start();
    }, 100);
  };

  const updateSnapState = () => {
    "worklet";
    const dir = translateY.get() - startY.get();
    const isDownwardSwipe = dir > 0 && translateY.get() > THRESHOLD;
    const isUpwardSwipe =
      dir < 0 && translateY.get() < MAX_TRANSLATE - THRESHOLD / 3;
    const isPastMidpoint = translateY.get() >= MAX_TRANSLATE / 2;

    const value = !isUpwardSwipe && (isDownwardSwipe || isPastMidpoint);
    scheduleOnRN(value ? startRecording : stopRecording);

    snapped.set(value);
  };

  const nativeGesture = useNativeGesture({});

  const innerPanGesture = usePanGesture({
    // activeOffsetY: innerActiveOffset,
    activeOffsetX: [-5, Number.MAX_VALUE],
    block: nativeGesture,
    // requireToFail: nativeGesture,
  });

  const panGesture = usePanGesture({
    onBegin: () => {
      startY.set(translateY.get());
      isDragging.set(false);
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

      updateSnapState();

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
    // failOffsetX: failOffsetX,
    activeOffsetY: activeOffsetY,
    activeOffsetX: activeOffsetX,
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

  const scrollEnabled = useDerivedValue<boolean | undefined>(() => {
    return translateY.get() <= THRESHOLD;
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.set(event.contentOffset.y);
    },
    onBeginDrag: () => {
      scrolling.set(true);
    },
    onEndDrag: () => {
      scrolling.set(false);
    },
  });

  return (
    <UntitledScreen barProps={{ type: "fill", hide: snapped }} hideHeader>
      <GestureDetector gesture={underPanGesture}>
        <AnimatedThemedView
          style={[styles.under, underAnimatedStyle]}
          collapsable={false}
          colorName="untitledFg"
        >
          <RecordPage
            ref={recordRef}
            translateY={translateY}
            treshold={THRESHOLD}
            maxTranslateY={MAX_TRANSLATE}
            isDragging={isDragging}
            snapped={snapped}
            startRecording={startRecording}
            stopRecording={stopRecording}
            toggleRecording={toggleRecording}
            restartRecording={restartRecording}
            pauseRecording={pauseRecording}
            resumeRecording={resumeRecording}
            sharedState={recordState}
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

        <GestureDetector gesture={panGesture}>
          <View style={{ flex: 1 }} collapsable={false}>
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
                  onScroll={scrollHandler}
                  scrollEventThrottle={16}
                  showsVerticalScrollIndicator={false}
                  contentInset={{ bottom: 125 }}
                >
                  <GestureDetector gesture={innerPanGesture}>
                    <View style={{ flexGrow: 1 }} collapsable={false}>
                      <UntitledCardLarge
                        scrolling={scrolling}
                        onRecord={startRecording}
                      />
                    </View>
                  </GestureDetector>
                </ScrollView>
              </GestureDetector>
            </Animated.View>
            <Animated.View style={[styles.bar, barAnimatedStyle]}>
              <ThemedView style={styles.barIcon} colorName="text" />
            </Animated.View>
          </View>
        </GestureDetector>
      </Animated.View>
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
    boxShadow: "0px -20px 50px #00000010",
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
