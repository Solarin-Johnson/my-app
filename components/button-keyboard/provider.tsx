import React, {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useRef,
} from "react";
import { findNodeHandle, TextInput, View } from "react-native";
import Animated, {
  AnimatedRef,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { ButtonKeyboardContextValue } from "./types";

const ButtonKeyboardContext = createContext<ButtonKeyboardContextValue | null>(
  null,
);

export type ProviderProps = {
  children: React.ReactNode;
};

export type FieldRef = AnimatedRef<TextInput>;

export function Provider({ children }: ProviderProps) {
  const value = useSharedValue("");
  const charValue = useSharedValue("");
  const isChanging = useSharedValue(false);
  const isKeyboardOpened = useSharedValue(false);

  const closeKeyboard = () => {
    isKeyboardOpened.set(false);
  };

  const openKeyboard = () => {
    isKeyboardOpened.set(true);
  };

  return (
    <ButtonKeyboardContext.Provider
      value={{
        value,
        charValue,
        isChanging,
        closeKeyboard,
        openKeyboard,
        isKeyboardOpened,
      }}
    >
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
