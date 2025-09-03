import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { useNavigation, withLayoutContext } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ChevronLeft } from "lucide-react-native";
import type {
  ParamListBase,
  StackNavigationState,
} from "@react-navigation/native";
import Transition, {
  createNativeStackNavigator,
  type NativeStackNavigationEventMap,
  type NativeStackNavigationOptions,
} from "react-native-screen-transitions";
import { interpolate, useSharedValue } from "react-native-reanimated";

const { Navigator } = createNativeStackNavigator();

export const Stack = withLayoutContext<
  NativeStackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  NativeStackNavigationEventMap
>(Navigator);

export default function Layout() {
  const bg = useThemeColor("waBg");

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Status",
          headerShown: true,
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <HeaderRight />,
          headerBackground: () => (
            <BlurView style={StyleSheet.absoluteFill} intensity={60} />
          ),
          headerTransparent: true,
          contentStyle: { backgroundColor: bg },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          gestureEnabled: true,
          gestureDirection: "vertical",
          enableTransitions: true,
          screenStyleInterpolator: ({
            layouts: {
              screen: { width, height },
            },
            progress,
            current,
            insets,
          }) => {
            "worklet";

            const scale = interpolate(progress, [0, 0.8, 1, 2], [0, 1, 1, 1]);
            const borderRadius = interpolate(progress, [0, 1, 2], [2000, 0, 0]);

            const translateY = interpolate(
              current.gesture.y + insets.top + insets.bottom,
              [0, height / 3, height],
              [0, 0, height]
            );

            const yThreshold = height / 3;
            const currentY = current.gesture.y + insets.top + insets.bottom;
            const hasPassedThreshold = currentY > yThreshold;

            let translateX = 0;

            if (hasPassedThreshold) {
              const excessY = currentY - yThreshold;
              const maxExcessY = height - yThreshold;

              translateX =
                interpolate(
                  current.gesture.x,
                  [-width / 2, 0, width / 2],
                  [-width, 0, width],
                  "clamp"
                ) * interpolate(excessY, [0, maxExcessY], [0, 1], "clamp");
            }
            return {
              contentStyle: {
                transform: [{ scale }, { translateY }, { translateX }],
                borderRadius,
              },
            };
          },
          transitionSpec: {
            close: Transition.specs.DefaultSpec,
            open: Transition.specs.DefaultSpec,
          },
          // ...Transition.presets.ZoomIn(),
        }}
      />
    </Stack>
  );
}

const HeaderRight = () => {
  return (
    <Pressable
      style={{
        width: 50,
        alignItems: "center",
        justifyContent: "center",
      }}
      hitSlop={8}
    >
      <ThemedText style={{ fontSize: 17 }}>Edit</ThemedText>
    </Pressable>
  );
};

const HeaderLeft = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Pressable
      onPress={() => navigation.openDrawer()}
      style={{
        width: 34,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      hitSlop={8}
    >
      <ThemedTextWrapper>
        <ChevronLeft size={28} />
      </ThemedTextWrapper>
    </Pressable>
  );
};
