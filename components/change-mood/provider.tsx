import React, { createContext, useContext, type ReactNode } from "react";
import {
  SharedValue,
  useSharedValue,
  WithSpringConfig,
} from "react-native-reanimated";

type ChangeMoodContextValue = {
  currentIndex: SharedValue<number>;
  goToIndex: (index: number) => void;
};

export type ChangeMoodProviderProps = {
  children: ReactNode;
  currentIndex?: SharedValue<number>;
};

export const SPRING_CONFIG_BOUNCE: WithSpringConfig = {
  stiffness: 200,
  damping: 21,
  mass: 1.1,
  energyThreshold: 0.00001,
};

export const SPRING_CONFIG = {
  stiffness: 210,
  damping: 24,
  mass: 1,
};

export const SPRING_CONFIG_FAST = {
  stiffness: 250,
  damping: 20,
  mass: 1,
};

const ChangeMoodContext = createContext<ChangeMoodContextValue | null>(null);

export function ChangeMoodProvider({
  children,
  currentIndex: currentIndexProp,
}: ChangeMoodProviderProps) {
  const currentIndexValue = useSharedValue(0);
  const currentIndex = currentIndexProp || currentIndexValue;

  const goToIndex = (index: number) => {
    currentIndex.value = index;
  };
  return (
    <ChangeMoodContext.Provider value={{ currentIndex, goToIndex }}>
      {children}
    </ChangeMoodContext.Provider>
  );
}

export function useChangeMood() {
  const ctx = useContext(ChangeMoodContext);
  if (!ctx) {
    throw new Error("useChangeMood must be used within a ChangeMoodProvider");
  }
  return ctx;
}
