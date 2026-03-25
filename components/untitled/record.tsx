import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Record, { RecordHandle } from "../recorder/Record";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FancyStrokeButton from "../ui/fancy-stroke-button";
import { Pressable, StyleSheet, View } from "react-native";
import { scheduleOnRN } from "react-native-worklets";
import { Feedback } from "@/functions";
import { SPRING_CONFIG } from "@/constants";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import { StackedButton } from "../stacked-button";
import { ButtonCluster, ButtonIcon, ButtonItem } from ".";
import { RefreshCcw, Trash2 } from "lucide-react-native";
import { ThemedView, ThemedViewWrapper } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { RecordingState } from "../recorder/types";
import { AnimatedText } from "../ui/animated-text";

type RecordingCallbacks = {
  startRecording?: () => Promise<void>;
  stopRecording?: () => Promise<void>;
  toggleRecording?: () => void;
  restartRecording: () => Promise<void>;
  pauseRecording?: () => void;
  resumeRecording?: () => void;
  sharedState?: SharedValue<RecordingState>;
};

interface RecordProps {
  //   dragProgress: SharedValue<number>;
  maxTranslateY: number;
  translateY: SharedValue<number>;
  treshold: number;
  isDragging: SharedValue<boolean>;
  snapped: SharedValue<boolean>;
  ref: React.RefObject<RecordHandle>;
}

const hapticsFeedback = () => {
  Feedback.selection();
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const BTN_HEIGHT = 38;
const PULSE_SPRING_CONFIG = {
  damping: 14,
  stiffness: 220,
  mass: 0.8,
  overshootClamping: false,
  restDisplacementThreshold: 0.0001,
  restSpeedThreshold: 0.0001,
};

export default function RecordPage({
  maxTranslateY,
  translateY,
  treshold,
  isDragging,
  snapped,
  ref: recordRef,
  ...props
}: RecordProps & RecordingCallbacks) {
  const { sharedState, resumeRecording } = props;
  const { top } = useSafeAreaInsets();

  const durationMS = useSharedValue(0);

  const islandHeight = top - 12;

  const topSpace = islandHeight + BTN_HEIGHT;
  const max = maxTranslateY - topSpace * 2;

  const progress = useDerivedValue(() => {
    return interpolate(
      translateY.get(),
      [0, topSpace, maxTranslateY],
      [0, 0, 1],
      Extrapolation.CLAMP,
    );
  });

  const strokeProgress = useDerivedValue(() => {
    return interpolate(
      translateY.get(),
      [0, topSpace, treshold],
      [0, 0, 1],
      Extrapolation.CLAMP,
    );
  });

  const hitThreshold = useDerivedValue(() => {
    return translateY.get() >= treshold;
  });

  const btnAnimatedStyle = useAnimatedStyle(() => {
    const isSnapped = snapped.get();
    const d = maxTranslateY - topSpace;
    const translateY =
      isSnapped && !isDragging.get()
        ? withSpring(d)
        : isSnapped
          ? d
          : interpolate(progress.value, [0, 1], [0, max], Extrapolation.CLAMP);

    return {
      transform: [{ translateY }],
    };
  });

  const recordAnimatedStyle = useAnimatedStyle(() => {
    const hit = hitThreshold.get();

    const scale = withSpring(
      hit ? 1.2 : 1,
      hit ? PULSE_SPRING_CONFIG : SPRING_CONFIG,
    );
    return {
      opacity: withSpring(isDragging.get() && !snapped.get() ? 1 : 0),
      transform: [{ scale }],
    };
  });

  const actionAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: snapped.get() ? withSpring(1) : 0,
    };
  });

  useAnimatedReaction(
    () => strokeProgress.value,
    (value, prev) => {
      if (value === 1 && prev && value !== prev) {
        scheduleOnRN(hapticsFeedback);
      }
    },
  );

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(snapped.get() ? 1 : 0),
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(
        sharedState?.value === RecordingState.Recording ? 0 : 0.6,
        StackedButton.springConfig,
      ),
    };
  });

  const time = useDerivedValue(() => {
    const totalMS = durationMS.value;
    const minutes = Math.floor(totalMS / 60000);
    const seconds = Math.floor((totalMS % 60000) / 1000);
    const milliseconds = Math.floor((totalMS % 1000) / 10);

    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");
    const ms = milliseconds.toString().padStart(2, "0");

    return `${mm}:${ss}:${ms}`;
  });

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
        <SafeAreaView
          style={[
            styles.content,
            {
              maxHeight: maxTranslateY + topSpace,
            },
          ]}
        >
          <View style={styles.head}>
            <ThemedText style={styles.title}>New Recording</ThemedText>
            <ThemedText style={styles.subtitle} type="regular">
              untitled project
            </ThemedText>
          </View>
          <View
            style={[
              styles.waveWrapper,
              {
                paddingBottom: topSpace,
              },
            ]}
          >
            <Record
              ref={recordRef}
              sharedState={sharedState}
              durationMS={durationMS}
            />
            <ThemedView style={styles.line} colorName="theme">
              <ThemedView style={styles.reader}>
                <ThemedTextWrapper>
                  <AnimatedText text={time} style={styles.text} />
                </ThemedTextWrapper>
              </ThemedView>
            </ThemedView>
          </View>
          <ThemedViewWrapper colorName="untitledFg">
            <AnimatedPressable
              style={[StyleSheet.absoluteFill, overlayAnimatedStyle]}
              onPress={resumeRecording}
            />
          </ThemedViewWrapper>
        </SafeAreaView>
      </Animated.View>
      <Animated.View
        style={[
          styles.buttonWrapper,
          { top: islandHeight - BTN_HEIGHT },
          btnAnimatedStyle,
        ]}
      >
        <Animated.View style={[styles.button, recordAnimatedStyle]}>
          <FancyStrokeButton progress={strokeProgress} />
        </Animated.View>
        <Animated.View style={[styles.action, actionAnimatedStyle]}>
          <BottomAction {...props} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const BottomAction = ({
  stopRecording,
  restartRecording,
  pauseRecording,
  sharedState,
}: RecordingCallbacks) => {
  const initialIndex = 0;
  const currentIndex = useSharedValue(0);
  const appleRed = useThemeColor("appleRed");
  const bg = useThemeColor("untitledBg");

  const redStyle = {
    backgroundColor: appleRed,
  };

  const bgStyle = {
    backgroundColor: bg,
  };

  useAnimatedReaction(
    () => sharedState?.value,
    (value) => {
      if (value === RecordingState.Recording) {
        currentIndex.set(initialIndex);
      }
    },
  );

  return (
    <View style={styles.footer}>
      <StackedButton.Provider
        currentIndex={currentIndex}
        itemStyles={{
          borderRadius: 25,
          borderCurve: "continuous",
          alignItems: "center",
          justifyContent: "center",
          height: 50,
        }}
        initialIndex={initialIndex}
        gap={12}
      >
        <StackedButton.Container style={{ width: "100%", paddingVertical: 16 }}>
          <ButtonItem
            expandedElement={
              <ButtonCluster
                type="semiBold"
                text="Cancel Recording"
                icon={<ButtonIcon icon={Trash2} size={19} colorName="white" />}
                colorName="white"
              />
            }
            expandedStyle={redStyle}
            onPress={stopRecording}
            handleConfirmation={pauseRecording}
          >
            <ButtonCluster
              text="Cancel"
              colorName="appleRed"
              icon={<ButtonIcon icon={Trash2} size={19} colorName="appleRed" />}
              type="semiBold"
            />
          </ButtonItem>
          <ThemedViewWrapper colorName="untitledBg">
            <ButtonItem
              disableExpand
              onPress={stopRecording}
              style={{ backgroundColor: "red" }}
            >
              <ButtonCluster text="Save" type="semiBold" />
            </ButtonItem>
          </ThemedViewWrapper>

          <ButtonItem
            expandedElement={
              <ButtonCluster
                text="Retry Recording"
                icon={<ButtonIcon icon={RefreshCcw} size={19} />}
                type="semiBold"
              />
            }
            expandedStyle={bgStyle}
            handleConfirmation={pauseRecording}
            onPress={restartRecording}
          >
            <ButtonCluster
              text="Retry"
              icon={<ButtonIcon icon={RefreshCcw} size={19} />}
              type="semiBold"
              ellipsizeMode="clip"
            />
          </ButtonItem>
        </StackedButton.Container>
      </StackedButton.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    position: "absolute",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    alignSelf: "center",
  },
  action: {
    position: "absolute",
    // backgroundColor: "red",
    width: "100%",
  },
  content: {
    flex: 1,
    paddingVertical: 32,
  },
  head: {
    paddingTop: 42,
    gap: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 15,
    letterSpacing: -0.2,
    opacity: 0.65,
  },
  footer: {
    width: "100%",
    paddingHorizontal: 24,
  },
  waveWrapper: {
    width: "50%",
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    height: 120,
    width: 1.5,
    marginLeft: -2,
  },
  reader: {
    position: "absolute",
    width: 86,
    height: 32,
    top: -32,
    left: -42.5,
    borderRadius: 16,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontVariant: ["tabular-nums"],
    fontSize: 13,
    fontWeight: "200",
    fontFamily: "ui-monospace",
  },
});
