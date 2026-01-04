import { View, Text, StyleSheet, TextInput } from "react-native";
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
  return (
    <View style={styles.messageCard}>
      <MessageBox recording={recording} timer={timer} />
      <RecordButton recording={recording} timer={timer} />
    </View>
  );
};

type ItemProps = {
  recording: SharedValue<boolean>;
  timer: SharedValue<number>;
};

const MessageBox = ({ recording, timer }: ItemProps) => {
  const notRecording = useDerivedValue(() => !recording.value);

  const createIconAnimatedStyle = (isVisible: SharedValue<boolean>) =>
    useAnimatedStyle(() => {
      return {
        opacity: withTiming(isVisible.value ? 0 : 1, {
          duration: isVisible.value ? 50 : 300,
        }),
        transform: [
          {
            scale: withTiming(isVisible.value ? 0.5 : 1, {
              duration: isVisible.value ? 100 : 300,
            }),
          },
        ],
      };
    });

  const plusAnimatedStyle = createIconAnimatedStyle(recording);
  const micAnimatedStyle = createIconAnimatedStyle(notRecording);

  return (
    <ThemedView style={styles.messageBox}>
      <View style={styles.msgBoxButton}>
        <Animated.View style={[styles.buttonItem, plusAnimatedStyle]}>
          <ThemedTextWrapper>
            <Plus />
          </ThemedTextWrapper>
        </Animated.View>
        <Animated.View style={[styles.buttonItem, micAnimatedStyle]}>
          <ThemedTextWrapper>
            <Mic />
          </ThemedTextWrapper>
        </Animated.View>
      </View>
      <ThemedTextWrapper style={styles.input} ignoreStyle={false}>
        <TextInput placeholder="Type your message..." />
      </ThemedTextWrapper>
    </ThemedView>
  );
};

const RecordButton = ({ recording, timer }: ItemProps) => {
  const panGesture = Gesture.Pan()
    .onTouchesDown(() => {
      recording.value = true;
      timer.value = 0;
    })
    .onUpdate(() => {
      // Update timer or other values if needed
    })
    .onTouchesUp(() => {
      recording.value = false;
    })
    .onTouchesCancelled(() => {
      recording.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(recording.value ? 1.6 : 1),
        },
        {
          translateX: withSpring(recording.value ? -8 : 0),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.recordContainer}>
        <AnimatedThemedView
          style={[styles.recordButton, animatedStyle]}
          colorName="text"
        >
          <ThemedTextWrapper colorName="background">
            <Mic />
          </ThemedTextWrapper>
        </AnimatedThemedView>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  messageCard: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
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
    padding: 4,
    aspectRatio: 1,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  recordContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  recordButton: {
    borderRadius: 50,
    padding: 12,
  },
});
