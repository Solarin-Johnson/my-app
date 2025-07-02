import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import TopBar from "@/components/TopBar";
import { View } from "react-native";

const SPRING_CONFIG = {
  stiffness: 180,
  damping: 28,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.000001,
  restSpeedThreshold: 0.000001,
};

export default function GestureNav() {
  const text = useThemeColor("text");
  const barColor = useThemeColor("barColor");
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const pressed = useSharedValue(false);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      // Apply a non-linear "stiffness" as translation increases
      const damped = e.translationY * 0.7;
      translateY.value = Math.max(
        0,
        damped - 0.0005 * Math.pow(Math.max(0, damped), 2)
      );
    })
    .onEnd(() => {
      translateX.value = withSpring(0, SPRING_CONFIG);
      translateY.value = withSpring(0, SPRING_CONFIG);
      pressed.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View
        style={{
          flex: 1,
          backgroundColor: text + "1A",
        }}
      >
        <TopBar
          translateX={translateX}
          translateY={translateY}
          pressed={pressed}
        />
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: barColor,
            }}
          >
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: 20,
              }}
            >
              Pull Down
            </ThemedText>
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
