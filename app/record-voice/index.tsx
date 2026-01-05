import { View, StyleSheet, TextInput } from "react-native";
import React from "react";
import { Mic, Plus } from "lucide-react-native";
import { ThemedTextWrapper } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ShimmeringText from "@/components/ui/ShimmeringText";
import FadeLoop from "@/components/ui/FadeLoop";

const TRESHOLD_CANCEL = 100;

const AnimatedThemedView = Animated.createAnimatedComponent(ThemedView);

export default function Index() {
  return (
    <ThemedView style={styles.container} colorName="barColor">
      <MessageCard />
    </ThemedView>
  );
}

const MessageCard = () => {
  const recording = useSharedValue(!false);
  const timer = useSharedValue(0);
  const isDeleting = useSharedValue(!false);
  return (
    <View style={styles.messageCard}>
      <MessageBox recording={recording} timer={timer} isDeleting={isDeleting} />
      <RecordButton
        recording={recording}
        timer={timer}
        isDeleting={isDeleting}
      />
    </View>
  );
};

type ItemProps = {
  recording: SharedValue<boolean>;
  timer: SharedValue<number>;
  isDeleting: SharedValue<boolean>;
};

const MessageBox = ({ recording, timer, isDeleting }: ItemProps) => {
  const notRecording = useDerivedValue(() => !recording.value);
  const startFadeLoop = useDerivedValue(() => {
    return recording.value && !isDeleting.value;
  });

  const createIconAnimatedStyle = (
    isVisible: SharedValue<boolean>,
    scale: number = 0.5
  ) =>
    useAnimatedStyle(() => {
      return {
        opacity: withTiming(isVisible.value ? 0 : 1, {
          duration: isVisible.value ? 50 : 300,
        }),
        transform: [
          {
            scale: withTiming(isVisible.value ? scale : 1, {
              duration: isVisible.value ? 100 : 300,
            }),
          },
        ],
      };
    });

  const plusAnimatedStyle = createIconAnimatedStyle(recording);
  const micAnimatedStyle = createIconAnimatedStyle(notRecording);
  const inputAnimatedStyle = createIconAnimatedStyle(recording, 1);
  const shimmerAnimatedStyle = createIconAnimatedStyle(notRecording, 1);
  const binAnimatedStyle = createIconAnimatedStyle(isDeleting);

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
            <ThemedTextWrapper>
              <Mic />
            </ThemedTextWrapper>
          </FadeLoop>
        </Animated.View>
        <Animated.View style={[styles.buttonItem, micAnimatedStyle]}>
          <ThemedTextWrapper>
            <Mic />
          </ThemedTextWrapper>
        </Animated.View>
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
        if (isDeleting) {
          isDeleting.value = true;
        }
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
    fontSize: 16,
    textAlign: "right",
    opacity: 0.8,
  },
});
