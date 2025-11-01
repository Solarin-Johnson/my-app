import React from "react";
import UntitledHeader, { UntitledHeaderProps } from "./header";
import Transition, {
  useScreenAnimation,
} from "react-native-screen-transitions";
import UntitledBottomBar, { UntitledBottomBarProps } from "./bottom-bar";

const ScrollView = Transition.ScrollView;

export default function UntitledScreen({
  children,
  headerProps,
  barProps,
}: {
  children?: React.ReactNode;
  headerProps?: UntitledHeaderProps;
  barProps?: UntitledBottomBarProps;
}) {
  const props = useScreenAnimation();

  return (
    <>
      <UntitledHeader contentStyle={{ height: 50 }} {...headerProps} />
      <ScrollView style={{ flex: 1 }}>{children}</ScrollView>
      <UntitledBottomBar {...barProps} />
    </>
  );
}
