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
import Transition from "react-native-screen-transitions";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
} from "react-native-reanimated";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import UntitledHeader from "@/components/untitled/header";
import { scheduleOnRN } from "react-native-worklets";
import { Feedback } from "@/functions";

const AnimatedThemedView = Animated.createAnimatedComponent(ThemedView);

const ScrollView = Transition.ScrollView;

const hapticsFeedback = () => {
  scheduleOnRN(Feedback.selection);
};

const THRESHOLD = 180;

export default function Index() {
  const scrollRef = useRef(null);
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);

  const record = useSharedValue(false);
  const snapped = useSharedValue(false);

  const nativeGesture = useNativeGesture({});

  const { height } = useWindowDimensions();

  const failOffset = useDerivedValue(() => {
    return record.value ? Number.MAX_VALUE : 0;
  });

  const MAX_TRANSLATE = height - 200;

  const innerPanGesture = usePanGesture({
    activeOffsetY: [-Number.MAX_VALUE, 0],
    activeOffsetX: [0, Number.MAX_VALUE],
    block: nativeGesture,
  });

  const panGesture = usePanGesture({
    onBegin: (e) => {
      startY.set(translateY.get());
    },
    onUpdate: (e) => {
      const next = startY.value + e.translationY;
      let clamped = Math.min(MAX_TRANSLATE, Math.max(0, next));
      clamped += e.velocityY * 0.01;
      translateY.value = Math.min(MAX_TRANSLATE, Math.max(0, clamped));

      console.log(translateY.value);
    },
    onDeactivate: (e) => {
      const dir = translateY.value - startY.value;
      const isDownwardSwipe = dir > 0 && translateY.value > THRESHOLD;
      const isUpwardSwipe =
        dir < 0 && translateY.value < MAX_TRANSLATE - THRESHOLD;
      const isPastMidpoint = translateY.value >= MAX_TRANSLATE / 2;

      snapped.value = !isUpwardSwipe && (isDownwardSwipe || isPastMidpoint);

      translateY.set(
        withDecay({
          velocity: e.velocityY * 0.005,
          deceleration: 0.999,
        }),
      );

      translateY.value = withSpring(
        isDownwardSwipe
          ? MAX_TRANSLATE
          : isUpwardSwipe
            ? 0
            : isPastMidpoint
              ? MAX_TRANSLATE
              : 0,
      );
    },
    failOffsetX: [-Number.MAX_VALUE, failOffset],
    simultaneousWith: innerPanGesture,
  });

  const underPanGesture = usePanGesture({});

  const pageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  useAnimatedReaction(
    () => translateY.get(),
    (current) => {
      record.value = current > THRESHOLD;
    },
  );

  const scrollEnabled = useDerivedValue<boolean | undefined>(() => {
    return !record.value;
  });

  return (
    <UntitledScreen barProps={{ type: "fill", hide: snapped }} hideHeader>
      <GestureDetector gesture={panGesture}>
        <View style={{ flex: 1 }}>
          <GestureDetector gesture={underPanGesture}>
            <View style={StyleSheet.absoluteFill} collapsable={false} />
          </GestureDetector>
          <Animated.View style={[{ flex: 1 }, pageAnimatedStyle]}>
            <UntitledHeader contentStyle={{ height: 50 }}>
              <Header />
            </UntitledHeader>
            <GestureDetector gesture={nativeGesture}>
              <ScrollView
                ref={scrollRef}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={scrollEnabled}
              >
                <GestureDetector gesture={innerPanGesture}>
                  <View style={{ flexGrow: 1 }} collapsable={false}>
                    <UntitledCardLarge />
                  </View>
                </GestureDetector>
              </ScrollView>
            </GestureDetector>
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
