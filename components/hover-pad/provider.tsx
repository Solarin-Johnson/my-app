import React, { createContext, useContext, useState } from "react";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import {
  HoverPadContextValue,
  PositionType,
  ProviderType,
  StateType,
} from "./types";
import Pad from "./pad";

const HoverPadContext = createContext<HoverPadContextValue | null>(null);

export const useHoverPad = () => {
  const ctx = useContext(HoverPadContext);
  if (!ctx) {
    throw new Error("useHoverPad must be used within a HoverPad provider");
  }
  return ctx;
};

const HoverPadProvider = ({
  children,
  onItemHover,
  ...props
}: ProviderType) => {
  const position = useSharedValue<PositionType>({ x: null, y: null });
  const state = useSharedValue<StateType>("idle");
  const hoveredIndex = useSharedValue<number | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const resetPosition = () => {
    "worklet";
    position.set({ x: null, y: null });
  };

  useAnimatedReaction(
    () => hoveredIndex.value,
    (current, previous) => {
      console.log(hoveredIndex.value);
      if (current !== previous && current != null) {
        if (onItemHover) {
          scheduleOnRN(onItemHover);
        }
      }
    },
  );

  return (
    <HoverPadContext.Provider
      value={{
        position,
        state,
        resetPosition,
        hoveredIndex,
        onItemHover,
        totalItems,
        setTotalItems,
      }}
    >
      {children}
    </HoverPadContext.Provider>
  );
};

export default HoverPadProvider;
