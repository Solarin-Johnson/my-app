import { View, StyleSheet, TextInput, Button } from "react-native";
import React from "react";
import { Mic, Plus, Trash } from "lucide-react-native";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ShimmeringText from "@/components/ui/ShimmeringText";
import FadeLoop from "@/components/ui/FadeLoop";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { TrashBase, TrashCover } from "@/components/icons";

const TRESHOLD_CANCEL = 150;

const AnimatedThemedView = Animated.createAnimatedComponent(ThemedView);

export default function Index() {
  return (
    <ThemedView style={styles.container} colorName="barColor">
      <MessageCard />
    </ThemedView>
  );
}

const MessageCard = () => {
  const recording = useSharedValue(false);
  const timer = useSharedValue(0);
  const isDeleting = useSharedValue(false);
  return (
    <>
      <View style={styles.messageCard}>
        <MessageBox
          recording={recording}
          timer={timer}
          isDeleting={isDeleting}
        />
        <RecordButton
          recording={recording}
          timer={timer}
          isDeleting={isDeleting}
        />
      </View>
      {/* <Button
        title="Toggle Recording"
        onPress={() => {
          recording.value = !recording.value;
        }}
      />
      <Button
        title="Toggle Deleting"
        onPress={() => {
          recording.value = !isDeleting.value;
          isDeleting.value = !isDeleting.value;
        }}
      /> */}
    </>
  );
};

type ItemProps = {
  recording: SharedValue<boolean>;
  timer: SharedValue<number>;
  isDeleting: SharedValue<boolean>;
};

const MessageBox = ({ recording, timer, isDeleting }: ItemProps) => {
  const notRecording = useDerivedValue(
    () => !recording.value && !isDeleting.value
  );
  const deletingOrRecording = useDerivedValue(
    () => isDeleting.value || recording.value
  );
  const startFadeLoop = useDerivedValue(() => {
    return recording.value && !isDeleting.value;
  });
  const micRotate = useDerivedValue(() => {
    return isDeleting.value ? withTiming(720, { duration: 500 }) : 0;
  });
  const micScale = useDerivedValue(() => {
    return isDeleting.value
      ? withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.5, { duration: 500 })
        )
      : 1;
  });
  const micTranslateY = useDerivedValue(() => {
    return isDeleting.value
      ? withSequence(
          withTiming(-100, { duration: 500 }),
          withTiming(2, { duration: 500 }),
          withTiming(2, { duration: 500 }, () => {
            isDeleting.value = false;
          })
        )
      : 0;
  });

  const createIconAnimatedStyle = (
    isVisible: SharedValue<boolean>,
    scale: number = 0.5
  ) =>
    useAnimatedStyle(() => {
      return {
        opacity: withTiming(isVisible.value ? 1 : 0, {
          duration: isVisible.value ? 300 : 50,
        }),
        transform: [
          {
            scale: withTiming(isVisible.value ? 1 : scale, {
              duration: isVisible.value ? 300 : 100,
            }),
          },
        ],
      };
    });

  const plusAnimatedStyle = createIconAnimatedStyle(notRecording);
  const inputAnimatedStyle = createIconAnimatedStyle(notRecording, 1);
  const shimmerAnimatedStyle = createIconAnimatedStyle(recording, 1);
  const binAnimatedStyle = createIconAnimatedStyle(isDeleting);
  const micAnimatedStyle = createIconAnimatedStyle(deletingOrRecording);

  const micDeleteAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${micRotate.value}deg` },
        { scale: micScale.value },
      ],
    };
  });

  const micDeleteWrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: micTranslateY.value }],
    };
  });

  return (
    <ThemedView style={styles.messageBox}>
      <View style={styles.msgBoxButton}>
        <Animated.View style={[styles.buttonItem, plusAnimatedStyle]}>
          <ThemedTextWrapper>
            <Plus />
          </ThemedTextWrapper>
        </Animated.View>
        <Animated.View style={[styles.buttonItem, micAnimatedStyle]}>
          <FadeLoop start={startFadeLoop}>
            <Animated.View style={micDeleteWrapperAnimatedStyle}>
              <Animated.View style={[micDeleteAnimatedStyle]}>
                <ThemedTextWrapper colorName="appleRed">
                  <Mic />
                </ThemedTextWrapper>
              </Animated.View>
            </Animated.View>
          </FadeLoop>
        </Animated.View>
        <TrashComponent isDeleting={isDeleting} style={binAnimatedStyle} />
      </View>
      <Animated.View style={[inputAnimatedStyle]}>
        <ThemedTextWrapper style={styles.input} ignoreStyle={false}>
          <TextInput placeholder="Type your message..." />
        </ThemedTextWrapper>
      </Animated.View>
      <Animated.View style={[styles.shimmerContainer, shimmerAnimatedStyle]}>
        <ShimmeringText
          text="‹  Slide to cancel"
          layerStyle={{ backgroundColor: "grey" }}
          textStyle={styles.shimmerText}
          rtl
          start={recording}
        />
      </Animated.View>
      <AnimatedThemedView
        style={[styles.durationContainer, shimmerAnimatedStyle]}
      >
        <ThemedText>0:12</ThemedText>
      </AnimatedThemedView>
    </ThemedView>
  );
};

const RecordButton = ({ recording, timer, isDeleting }: ItemProps) => {
  const translateX = useSharedValue(0);

  const onEnd = () => {
    "worklet";
    recording.value = false;
    translateX.value = withSpring(0);
  };
  const panGesture = Gesture.Pan()
    .onTouchesDown(() => {
      recording.value = true;
      timer.value = 0;
    })
    .onUpdate((e) => {
      if (e.translationX < -TRESHOLD_CANCEL) {
        onEnd();
        isDeleting.value = true;
        return;
      }
      translateX.value = e.translationX;
    })
    .onTouchesUp(() => {
      recording.value = false;
    })
    .onTouchesCancelled(() => {
      recording.value = false;
    })
    .onEnd(() => {
      onEnd();
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(recording.value ? 1.65 : 1),
        },
        {
          translateX: withSpring(recording.value ? -8 : 0),
        },
      ],
    };
  });

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: 48 + -Math.min(0, Math.max(-TRESHOLD_CANCEL, translateX.value)),
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.recordContainer, wrapperAnimatedStyle]}>
        <AnimatedThemedView
          style={[styles.recordButton, animatedStyle]}
          colorName="text"
        >
          <ThemedTextWrapper colorName="background">
            <Mic />
          </ThemedTextWrapper>
        </AnimatedThemedView>
      </Animated.View>
    </GestureDetector>
  );
};

const TrashComponent = ({
  isDeleting,
  ...props
}: {
  isDeleting: SharedValue<boolean>;
} & ViewProps) => {
  const createDerivedAnimation = (targetValue: number) =>
    useDerivedValue(() => {
      return isDeleting.value
        ? withSequence(
            withTiming(targetValue, { duration: 500 }),
            withTiming(targetValue, { duration: 500 }),
            withTiming(0, { duration: 250 })
          )
        : 0;
    });

  const rotation = createDerivedAnimation(-65);
  const translateY = createDerivedAnimation(-2);
  const translateX = createDerivedAnimation(-15);
  const animatedWrapperStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.buttonItem, props.style]}>
      <Animated.View style={[{ marginTop: 3 }, animatedWrapperStyle]}>
        <Animated.View style={animatedStyle}>
          <TrashCover color="grey" />
        </Animated.View>
      </Animated.View>
      <View style={{ marginTop: -3 }}>
        <TrashBase color="grey" />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  messageCard: {
    width: "100%",
    flexDirection: "row",
  },
  messageBox: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
    borderRadius: 50,
    gap: 6,
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  buttonItem: {
    position: "absolute",
    zIndex: 10,
  },
  msgBoxButton: {
    borderRadius: "50%",
    aspectRatio: 1,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  recordContainer: {
    justifyContent: "center",
    marginLeft: 8,
  },
  recordButton: {
    borderRadius: 50,
    width: 48,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  shimmerContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 180,
  },
  shimmerText: {
    fontSize: 17,
    textAlign: "right",
    opacity: 0.8,
  },
  durationContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
    paddingLeft: 48,
    paddingRight: 12,
    justifyContent: "center",
  },
});
