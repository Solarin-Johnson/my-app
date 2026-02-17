import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import type {
  ParamListBase,
  StackNavigationState,
} from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { interpolate } from "react-native-reanimated";
import {
  createBlankStackNavigator,
  type BlankStackNavigationEventMap,
  type BlankStackNavigationOptions,
} from "react-native-screen-transitions/blank-stack";

const { Navigator } = createBlankStackNavigator();

export const Stack = withLayoutContext<
  BlankStackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  BlankStackNavigationEventMap
>(Navigator);

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
      <Stack
        screenOptions={
          {
            // headerShown: false,
          }
        }
      >
        <Stack.Screen
          name="index"
          // options={{ contentStyle: { backgroundColor: bg } }}
        />
        <Stack.Screen
          name="[id]"
          options={{
            // enableTransitions: true,
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
                contentStyle: {
                  transform: [{ translateX: x }],
                },
              };
            },
            transitionSpec: {
              close: SPRING_CONFIG,
              open: SPRING_CONFIG,
            },
          }}
        />
      </Stack>
    </ThemedView>
  );
}
