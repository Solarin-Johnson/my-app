//@internal

import { Dispatch, ReactNode } from "react";
import { ViewProps } from "react-native";
import { SharedValue } from "react-native-reanimated";

export type ProviderType = {
  children?: ReactNode;
  onItemHover?: () => void;
} & ViewProps;

export type PositionType = {
  x: number | null;
  y: number | null;
};

export type StateType = "idle" | "touch" | "pan" | "holding";

export interface HoverPadContextValue {
  position: SharedValue<PositionType>;
  state: SharedValue<StateType>;
  resetPosition: () => void;
  hoveredIndex: SharedValue<number | null>;
  onItemHover?: () => void;
  totalItems: number;
  setTotalItems: Dispatch<React.SetStateAction<number>>;
}

export type UpdatePositionType = {
  absoluteX: number;
  absoluteY: number;
};
