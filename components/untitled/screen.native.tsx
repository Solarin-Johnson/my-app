import React from "react";
import UntitledHeader, { UntitledHeaderProps } from "./header";
import UntitledBottomBar, { UntitledBottomBarProps } from "./bottom-bar";

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
