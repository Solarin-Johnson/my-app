import { View, Text } from "react-native";
import React from "react";
import UntitledHeader, { UntitledHeaderProps } from "./header";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import Transition, {
  useScreenAnimation,
} from "react-native-screen-transitions";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const ScrollView = Transition.ScrollView;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function UntitledScreen({
  children,
  headerProps,
}: {
  children?: React.ReactNode;
  headerProps?: UntitledHeaderProps;
}) {
  const props = useScreenAnimation();

  return (
    <>
      <UntitledHeader contentStyle={{ height: 50 }} {...headerProps} />
      <ScrollView style={{ flex: 1 }}>{children}</ScrollView>
    </>
  );
}
