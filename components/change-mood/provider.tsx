import { Feedback } from "@/functions";
import React, { createContext, useContext, type ReactNode } from "react";
import {
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
  WithSpringConfig,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type ChangeMoodContextValue = {
  currentIndex: SharedValue<number>;
  goToIndex: (index: number) => void;
};

export type ChangeMoodProviderProps = {
  children: ReactNode;
  currentIndex?: SharedValue<number>;
};

export const SPRING_CONFIG_BOUNCE: WithSpringConfig = {
  stiffness: 170,
  damping: 17,
  mass: 1,
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

  useAnimatedReaction(
    () => currentIndex.value,
    (index, prev) => {
      if (index === prev) return;
      scheduleOnRN(() => {
        Feedback.light();
      });
    },
  );
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
