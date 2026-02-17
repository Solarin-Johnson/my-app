import React from "react";
import UntitledHeader, { UntitledHeaderProps } from "./header";
import Transition, {
  useScreenAnimation,
} from "react-native-screen-transitions";
import UntitledBottomBar, { UntitledBottomBarProps } from "./bottom-bar";
import { View } from "react-native";
import { ThemedView } from "../ThemedView";

const ScrollView = Transition.ScrollView;

export interface UntitledScreenProps {
  children?: React.ReactNode;
  headerProps?: UntitledHeaderProps;
  barProps?: UntitledBottomBarProps;
  hideHeader?: boolean;
}

export default function UntitledScreen({
  children,
  headerProps,
  barProps,
  hideHeader,
}: UntitledScreenProps) {
  const props = useScreenAnimation();

  return (
    <>
      {!hideHeader && (
        <UntitledHeader contentStyle={{ height: 50 }} {...headerProps} />
      )}
      {children}
      <UntitledBottomBar {...barProps} />
    </>
  );
}
