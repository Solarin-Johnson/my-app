import React from "react";
import UntitledHeader, { UntitledHeaderProps } from "./header";
import Transition, {
  useScreenAnimation,
} from "react-native-screen-transitions";
import UntitledBottomBar, { UntitledBottomBarProps } from "./bottom-bar";
import { View } from "react-native";

const ScrollView = Transition.ScrollView;

export default function UntitledScreen({
  children,
  headerProps,
  barProps,
  hideHeader,
}: {
  children?: React.ReactNode;
  headerProps?: UntitledHeaderProps;
  barProps?: UntitledBottomBarProps;
  hideHeader?: boolean;
}) {
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
