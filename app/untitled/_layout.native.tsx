import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { interpolate } from "react-native-reanimated";
import { BlankStack } from "react-native-screen-transitions/expo-router";

const SPRING_CONFIG = {
  damping: 50,
  stiffness: 400,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.0001,
  restSpeedThreshold: 0.0001,
};

// const TIMING_CONFIG = { duration: 100, easing: Easing.inOut(Easing.ease) };
// const SPRING_CONFIG = Transition.specs.DefaultSpec;

export default function Layout() {
  const bg = useThemeColor("untitledBg");
  return (
    <ThemedView style={{ flex: 1 }} colorName={"untitledBg"}>
      <BlankStack screenOptions={{}}>
        <BlankStack.Screen name="index" />
        <BlankStack.Screen
          name="[id]"
          options={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
            screenStyleInterpolator: ({
              layouts: {
                screen: { width },
              },
              progress,
            }) => {
              "worklet";

              const x = interpolate(progress, [0, 1, 2], [width, 0, -width]);
              return {
                content: {
                  style: {
                    transform: [{ translateX: x }],
                  },
                },
              };
            },
            transitionSpec: {
              close: SPRING_CONFIG,
              open: SPRING_CONFIG,
            },
          }}
        />
      </BlankStack>
    </ThemedView>
  );
}
