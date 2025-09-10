import React from "react";
import UntitledHeader, { UntitledHeaderProps } from "./header";
import Transition, {
  useScreenAnimation,
} from "react-native-screen-transitions";

const ScrollView = Transition.ScrollView;

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
