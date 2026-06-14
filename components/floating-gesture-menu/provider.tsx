import React, { createContext, useContext, useState, ReactNode } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

export type PositionType = {
  x: number | null;
  y: number | null;
};

export type StateType = "idle" | "touch" | "pan";

interface FloatingMenuContextValue {
  isOpened: boolean;
  close: () => void;
  open: () => void;
  bottomInset: number;
  position: SharedValue<PositionType>;
  state: SharedValue<StateType>;
  resetPosition: () => void;
  hoveredItem: SharedValue<number | null>;
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
};

const FloatingMenuProvider = ({
  children,
  bottomInset = 54,
  onOpen,
  onClose,
}: ProviderType) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const position = useSharedValue<PositionType>({ x: null, y: null });
  const state = useSharedValue<StateType>("idle");
  const hoveredItem = useSharedValue<number | null>(null);

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
        hoveredItem,
      }}
    >
      {children}
    </FloatingMenuContext.Provider>
  );
};

export default FloatingMenuProvider;
