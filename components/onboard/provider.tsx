"use client";

import React, { createContext, useContext, ReactNode } from "react";
import Animated, { SharedValue, useSharedValue } from "react-native-reanimated";

interface OnboardContextType {
  currentIndex: SharedValue<number>;
}

const OnboardContext = createContext<OnboardContextType | undefined>(undefined);

export interface OnboardProviderProps {
  children: ReactNode;
  currentIndex?: SharedValue<number>;
}

export function OnboardProvider({
  children,
  currentIndex: _currentIndex,
}: OnboardProviderProps) {
  const initCurrentIndex = useSharedValue(0);
  const currentIndex = _currentIndex || initCurrentIndex;

  return <OnboardContext value={{ currentIndex }}>{children}</OnboardContext>;
}

export function useOnboard() {
  const context = useContext(OnboardContext);
  if (!context) {
    throw new Error("useOnboard must be used within OnboardProvider");
  }
  return context;
}
