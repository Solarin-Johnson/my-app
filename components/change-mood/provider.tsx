import React, { createContext, useContext, type ReactNode } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

type ChangeMoodContextValue = {
  currentIndex: SharedValue<number>;
  goToIndex: (index: number) => void;
};

export type ChangeMoodProviderProps = {
  children: ReactNode;
  currentIndex?: SharedValue<number>;
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
