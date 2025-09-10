import { useThemeColor } from "@/hooks/useThemeColor";
import type {
  ParamListBase,
  StackNavigationState,
} from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { interpolate } from "react-native-reanimated";
import Transition, {
  createNativeStackNavigator,
  type NativeStackNavigationEventMap,
  type NativeStackNavigationOptions,
} from "react-native-screen-transitions";

const { Navigator } = createNativeStackNavigator();

export const Stack = withLayoutContext<
  NativeStackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  NativeStackNavigationEventMap
>(Navigator);

const SPRING_CONFIG = {
  damping: 80,
  stiffness: 600,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.0001,
  restSpeedThreshold: 0.0001,
};

// const TIMING_CONFIG = { duration: 100, easing: Easing.inOut(Easing.ease) };

export default function Layout() {
  const bg = useThemeColor("untitledBg");
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ contentStyle: { backgroundColor: bg } }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          enableTransitions: true,
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
  );
}
