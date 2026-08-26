import { Dispatch, ReactElement, ReactNode } from "react";
import { ViewProps } from "react-native";
import { SharedValue } from "react-native-reanimated";

export type ProviderType = {
  children?: ReactNode;
  onItemHover?: () => void;
};

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

export type BoundsType = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ItemType = ViewProps & {
  onPress?: () => void;
  index?: number;
  children?: ReactElement;
};

export type ItemChildType = {
  hovered: SharedValue<boolean>;
  active: SharedValue<boolean>;
  index: number;
};
