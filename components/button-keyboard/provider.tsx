import React, { createContext, useCallback, useContext } from "react";
import { TextInput } from "react-native";
import { AnimatedRef, useSharedValue } from "react-native-reanimated";
import { ButtonKeyboardContextValue, HashToggleTypes, PadProps } from "./types";
import { scheduleOnUI } from "react-native-worklets";

const ButtonKeyboardContext = createContext<ButtonKeyboardContextValue | null>(
  null,
);

export type ProviderProps = PadProps & {
  children: React.ReactNode;
};

export type FieldRef = AnimatedRef<TextInput>;

export const HASH_STATES: HashToggleTypes[] = [
  "CAPITALIZE",
  "LOWERCASE",
  "UPPERCASE",
  "NUMBERS",
];

export function Provider({ children }: ProviderProps) {
  const value = useSharedValue("");
  const charValue = useSharedValue("");
  const isChanging = useSharedValue(false);
  const isKeyboardOpened = useSharedValue(false);
  const hashState = useSharedValue<HashToggleTypes>("CAPITALIZE");
  const keyboardHeight = useSharedValue(0);

  const closeKeyboard = () => {
    scheduleOnUI(() => {
      if (!isKeyboardOpened.value) return;
      isKeyboardOpened.set(false);
    });
  };

  const openKeyboard = () => {
    scheduleOnUI(() => {
      if (isKeyboardOpened.value) return;
      isKeyboardOpened.set(true);
    });
  };

  const toggleHashState = useCallback(() => {
    hashState.set(
      HASH_STATES[
        (HASH_STATES.indexOf(hashState.value) + 1) % HASH_STATES.length
      ],
    );
  }, [hashState]);

  return (
    <ButtonKeyboardContext.Provider
      value={{
        value,
        charValue,
        isChanging,
        closeKeyboard,
        openKeyboard,
        isKeyboardOpened,
        toggleHashState,
        hashState,
        keyboardHeight,
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
