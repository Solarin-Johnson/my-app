import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";

export default function Rotate3d() {
  const rotation = useSharedValue(0);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateY: `${rotation.value}deg`,
        },
      ],
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateY: `${rotation.value + 180}deg`,
        },
      ],
    };
  });

  const isFlipped = useSharedValue(0);

  const flipCard = () => {
    isFlipped.value = isFlipped.value === 0 ? 1 : 0;
    rotation.value = withSpring(isFlipped.value === 0 ? 0 : 180);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={flipCard}>
        <View style={styles.flipCard}>
          <Animated.View
            style={[
              styles.flipCardItem,
              styles.flipCardFront,
              frontAnimatedStyle,
            ]}
          >
            <ThemedText style={styles.text}>Front Content</ThemedText>
          </Animated.View>
          <Animated.View
            style={[
              styles.flipCardItem,
              styles.flipCardBack,
              backAnimatedStyle,
            ]}
          >
            <ThemedText style={styles.text}>Back Content</ThemedText>
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  flipCard: {
    width: 240,
    height: 240,
    perspective: "100",
  },
  flipCardFront: {
    backgroundColor: "#007bff",
  },
  flipCardBack: {
    backgroundColor: "#28a745",
  },
  flipCardItem: {
    backfaceVisibility: "hidden",
    height: "100%",
    width: "100%",
    borderRadius: 8,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  text: {
    fontSize: 24,
  },
});
