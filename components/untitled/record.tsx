import React, { useRef } from "react";
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
import { StyleSheet, View } from "react-native";
import { scheduleOnRN } from "react-native-worklets";
import { Feedback } from "@/functions";
import { SPRING_CONFIG } from "@/constants";
import { ThemedText } from "../ThemedText";
import { StackedButton } from "../stacked-button";
import { ButtonCluster, ButtonIcon, ButtonItem } from ".";
import { RefreshCcw, Trash } from "lucide-react-native";
import { ThemedViewWrapper } from "../ThemedView";

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
}: RecordProps) {
  const { top } = useSafeAreaInsets();
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

  const startRecording = () => {
    recordRef.current?.start();
  };

  const stopRecording = () => {
    recordRef.current?.stop();
  };

  useAnimatedReaction(
    () => strokeProgress.value,
    (value, prev) => {
      if (value === 1 && prev && value !== prev) {
        scheduleOnRN(hapticsFeedback);
      }
    },
  );

  useAnimatedReaction(
    () => snapped.get(),
    (snappedValue, prev) => {
      if (snappedValue && !prev) {
        scheduleOnRN(startRecording);
      } else if (!snappedValue && prev) {
        scheduleOnRN(stopRecording);
      }
    },
  );

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(snapped.get() ? 1 : 0),
    };
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
              maxHeight: maxTranslateY,
            },
          ]}
        >
          <View style={styles.head}>
            <ThemedText style={styles.title}>New Recording</ThemedText>
            <ThemedText style={styles.subtitle} type="regular">
              untitled project
            </ThemedText>
          </View>
          <Record ref={recordRef} />
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
          <BottomAction />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const BottomAction = () => {
  const initialIndex = 0;
  const currentIndex = useSharedValue(0);
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
                text="Cancel Recording"
                icon={<ButtonIcon icon={Trash} />}
              />
            }
          >
            <ButtonCluster text="Cancel" icon={<ButtonIcon icon={Trash} />} />
          </ButtonItem>
          <ThemedViewWrapper colorName="untitledBg">
            <ButtonItem disableExpand>
              <ButtonCluster text="Save" />
            </ButtonItem>
          </ThemedViewWrapper>
          <ButtonItem
            expandedElement={
              <ButtonCluster
                text="Retry Recording"
                icon={<ButtonIcon icon={RefreshCcw} />}
              />
            }
          >
            <ButtonCluster
              text="Retry"
              icon={<ButtonIcon icon={RefreshCcw} />}
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
    alignItems: "center",
    justifyContent: "space-between",
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
});
