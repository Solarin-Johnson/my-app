import React, { createContext, useContext } from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";

export type ButtonKeyboardContextValue = {
  value: SharedValue<string>;
  isChanging: SharedValue<boolean>;
};

const ButtonKeyboardContext = createContext<ButtonKeyboardContextValue | null>(
  null,
);

export type ProviderProps = {
  children: React.ReactNode;
};

export function Provider({ children }: ProviderProps) {
  const value = useSharedValue("");
  const isChanging = useSharedValue(false);
  return (
    <ButtonKeyboardContext.Provider value={{ value, isChanging }}>
      {children}
    </ButtonKeyboardContext.Provider>
  );
}

export function useButtonKeyboard() {
  const context = useContext(ButtonKeyboardContext);

  if (!context) {
    throw new Error(
      "useButtonKeyboard must be used within a ButtonKeyboardProvider",
    );
  }

  return context;
}
