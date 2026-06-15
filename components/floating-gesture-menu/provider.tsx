import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export type PositionType = {
  x: number | null;
  y: number | null;
};

export type StateType = "idle" | "touch" | "pan" | "holding";

interface FloatingMenuContextValue {
  isOpened: boolean;
  close: () => void;
  open: () => void;
  bottomInset: number;
  position: SharedValue<PositionType>;
  state: SharedValue<StateType>;
  resetPosition: () => void;
  hoveredIndex: SharedValue<number | null>;
  onItemHover?: () => void;
}

const FloatingMenuContext = createContext<FloatingMenuContextValue | null>(
  null,
);

export const useFloatingMenu = () => {
  const ctx = useContext(FloatingMenuContext);
  if (!ctx) {
    throw new Error(
      "useFloatingMenu must be used within a FloatingMenuProvider",
    );
  }
  return ctx;
};

export type ProviderType = {
  children?: ReactNode;
  bottomInset?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onItemHover?: () => void;
};

const FloatingMenuProvider = ({
  children,
  bottomInset = 54,
  onOpen,
  onClose,
  onItemHover,
}: ProviderType) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const position = useSharedValue<PositionType>({ x: null, y: null });
  const state = useSharedValue<StateType>("idle");
  const hoveredIndex = useSharedValue<number | null>(null);

  const close = () => {
    setIsOpened(false);
    onClose?.();
  };

  const open = () => {
    setIsOpened(true);
    onOpen?.();
  };

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
    <FloatingMenuContext.Provider
      value={{
        isOpened,
        open,
        close,
        bottomInset,
        position,
        state,
        resetPosition,
        hoveredIndex,
        onItemHover,
      }}
    >
      {children}
    </FloatingMenuContext.Provider>
  );
};

export default FloatingMenuProvider;
