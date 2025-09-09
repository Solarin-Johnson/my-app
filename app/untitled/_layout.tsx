import { ThemedText } from "@/components/ThemedText";
import UntitledHeader from "@/components/untitled/header";
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
            close: Transition.specs.DefaultSpec,
            open: Transition.specs.DefaultSpec,
          },
        }}
      />
    </Stack>
  );
}
