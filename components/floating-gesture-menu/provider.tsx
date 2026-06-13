import React, { createContext, useContext, useState, ReactNode } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type PositionType = {
  x: number;
  y: number;
};

interface FloatingMenuContextValue {
  isOpened: boolean;
  close: () => void;
  open: () => void;
  bottomInset: number;
  position: SharedValue<PositionType>;
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
};

const FloatingMenuProvider = ({ children, bottomInset = 54 }: ProviderType) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const position = useSharedValue<PositionType>({ x: 0, y: 0 });

  const close = () => {
    setIsOpened(false);
  };

  const open = () => {
    setIsOpened(true);
  };

  return (
    <FloatingMenuContext.Provider
      value={{ isOpened, open, close, bottomInset, position }}
    >
      {children}
    </FloatingMenuContext.Provider>
  );
};

export default FloatingMenuProvider;
