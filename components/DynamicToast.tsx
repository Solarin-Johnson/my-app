import { View, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { DynamicToast } from "./dynamic-toast";
import {
  COLLAPSED_SPACE,
  EXPANDED_SPACE,
  useDynamicToast,
} from "./dynamic-toast/provider";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { ThemedText, ThemedTextWrapper } from "./ThemedText";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { RadialProgress } from "./ui/radial-progress";
import { withPause } from "react-native-redash";
import { ButtonWrapper } from "./dynamic-toast/toast";
import { AnimatedText } from "./ui/animated-text";
import { X } from "lucide-react-native";
import Button from "./ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import PressableBounce from "./PresableBounce";
import { scheduleOnUI } from "react-native-worklets";

export default function DynamicToastWrapper() {
  const { expanded, presented } = useDynamicToast();
  const downloadProgress = useSharedValue(0);
  const downloadCompleted = useSharedValue(false);
  const paused = useSharedValue(false);

  const itemProps = {
    downloadProgress,
    downloadCompleted,
    paused,
  };

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <PressableBounce
          onPress={() => {
            presented.value = true;
            paused.value = false;

            if (downloadProgress.value > 0) {
              console.log("heyyo");

              return;
            }
            downloadProgress.value = withPause(
              withTiming(100, { duration: 10000 }, () => {
                expanded.value = false;
                paused.value = true;
              }),
              paused,
            );
          }}
        >
          <ThemedText type="italic" style={{ fontSize: 24 }}>
            Start Download
          </ThemedText>
        </PressableBounce>
      </SafeAreaView>
      <DynamicToast.Toast>
        <CollapsedChild {...itemProps} />
        <ExpandedChild {...itemProps} />
      </DynamicToast.Toast>
    </>
  );
}

type ItemProps = {
  downloadProgress: SharedValue<number>;
  downloadCompleted: SharedValue<boolean>;
  paused: SharedValue<boolean>;
};

const CollapsedChild = ({ downloadProgress, downloadCompleted }: ItemProps) => {
  const { expanded, expandAnimationState, presented } = useDynamicToast();

  useAnimatedReaction(
    () => ({
      expandState: expandAnimationState.value,
      progress: downloadProgress.value,
    }),
    ({ expandState, progress }) => {
      if (progress >= 100 && expandState === 0) {
        expanded.value = true;
        downloadCompleted.value = true;
        downloadProgress.value = 0;
        downloadProgress.value = withDelay(
          3000,
          withTiming(0, { duration: 0 }, () => {
            expanded.value = false;
            presented.value = false;
          }),
        );
      }
    },
  );
  return (
    <>
      <DynamicToast.Inner expanded={expanded} type="collapsed">
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
              size={28}
              fadeOpacity={0.32}
            />
          </ThemedTextWrapper>
        </View>
      </DynamicToast.Inner>
    </>
  );
};

const ExpandedChild = ({
  downloadProgress,
  downloadCompleted,
  paused,
}: ItemProps) => {
  const { expanded, presented, backdropPressed } = useDynamicToast();

  const downloadPending = useDerivedValue(() => {
    return !downloadCompleted.value;
  });

  const percentage = useDerivedValue(() => {
    return `${Math.floor(downloadProgress.value)}%`;
  });

  const togglePlayPause = () => {
    paused.value = downloadProgress.value >= 100 ? true : !paused.value;
  };

  const playing = useDerivedValue(() => !paused.value);

  const createIconAnimatedStyle = (
    isVisible: SharedValue<boolean>,
    scale: number = 0.5,
  ) =>
    useAnimatedStyle(() => {
      const shouldShow = isVisible.value;
      return {
        opacity: withTiming(shouldShow ? 1 : 0, {
          duration: shouldShow ? 300 : 50,
        }),
        transform: [
          {
            scale: withTiming(shouldShow ? 1 : scale, {
              duration: shouldShow ? 300 : 100,
            }),
          },
        ],
      };
    });

  const playIconAnimatedStyle = createIconAnimatedStyle(paused, 0.5);
  const pauseIconAnimatedStyle = createIconAnimatedStyle(playing, 0.5);

  const close = () => {
    "worklet";
    presented.value = false;
    downloadCompleted.value = false;
    downloadProgress.value = 0;
    expanded.value = false;
  };

  useAnimatedReaction(
    () => backdropPressed.value,
    (value) => {
      if (value && downloadCompleted.value) {
        close();
      }
    },
  );
  return (
    <>
      <DynamicToast.Inner
        expanded={expanded}
        type="expanded"
        hide={downloadCompleted}
      >
        <View style={styles.cluster}>
          <ButtonWrapper color="orange" onPress={togglePlayPause}>
            <Animated.View style={[styles.buttonIcon, playIconAnimatedStyle]}>
              <ThemedTextWrapper colorName="orange">
                <Ionicons name="play" size={30} style={{ marginLeft: 2 }} />
              </ThemedTextWrapper>
            </Animated.View>
            <Animated.View style={[styles.buttonIcon, pauseIconAnimatedStyle]}>
              <ThemedTextWrapper colorName="orange">
                <Ionicons name="pause" size={30} />
              </ThemedTextWrapper>
            </Animated.View>
          </ButtonWrapper>
          <ButtonWrapper
            fadeOpacity={0.2}
            onPress={() => {
              scheduleOnUI(close);
            }}
          >
            <X color={"white"} size={30} strokeWidth={2.2} />
          </ButtonWrapper>
        </View>
        <Animated.View style={[styles.cluster, { gap: 4 }]}>
          {/* <ThemedText
                    style={[styles.toastText, styles.numberDesc]}
                    colorName="orange"
                  >
                    Download
                  </ThemedText> */}
          <ThemedTextWrapper
            style={[styles.toastTextLarge, styles.numberText]}
            colorName="orange"
          >
            <AnimatedText text={percentage} />
          </ThemedTextWrapper>
        </Animated.View>
      </DynamicToast.Inner>
      <DynamicToast.Inner
        expanded={expanded}
        type="expanded"
        hide={downloadPending}
      >
        <ThemedText colorName="orange" style={styles.toastTextMedium}>
          Downloaded
        </ThemedText>
        <View style={styles.cluster}>
          <ButtonWrapper
            fadeOpacity={0.2}
            onPress={() => {
              scheduleOnUI(close);
            }}
          >
            <X size={30} strokeWidth={2.2} />
          </ButtonWrapper>
        </View>
      </DynamicToast.Inner>
    </>
  );
};

const styles = StyleSheet.create({
  toastText: {
    fontSize: 15,
  },
  toastTextLarge: {
    fontSize: 36,
  },
  toastTextMedium: {
    fontSize: 28,
    paddingHorizontal: 8,
  },
  cluster: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8,
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
  numberText: {
    paddingRight: 8,
    width: 150,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  numberDesc: {
    lineHeight: 32,
  },
  button: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    borderRadius: "50%",
  },
  buttonIcon: {
    position: "absolute",
  },
});
