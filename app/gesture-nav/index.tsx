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

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateX.value = 0;
      translateY.value = withSpring(0, SPRING_CONFIG);
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
        <TopBar translateX={translateX} translateY={translateY} />
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: barColor,
            }}
          >
            <ThemedText type="defaultSemiBold">Pull Down</ThemedText>
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
