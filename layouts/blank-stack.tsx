// layouts/blank-stack.tsx
import "react-native-reanimated";
import type {
  ParamListBase,
  StackNavigationState,
} from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import type { ComponentProps } from "react";
import { Platform } from "react-native";
import {
  createBlankStackNavigator,
  type BlankStackNavigationEventMap,
  type BlankStackNavigationOptions,
} from "react-native-screen-transitions/blank-stack";

const { Navigator } = createBlankStackNavigator();

function BlankStackNavigator(props: ComponentProps<typeof Navigator>) {
  return <Navigator {...props} />;
}

export const BlankStack = withLayoutContext<
  BlankStackNavigationOptions,
  typeof BlankStackNavigator,
  StackNavigationState<ParamListBase>,
  BlankStackNavigationEventMap
>(BlankStackNavigator);
