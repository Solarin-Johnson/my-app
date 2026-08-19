// @internal

import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";

export type ButtonKeyboardInputRef = {
  focus: () => void;
  blur: () => void;
  delete: () => void;
  deleteAll: () => void;
};

export type ButtonKeyboardContextValue = {
  value: SharedValue<string>;
  charValue: SharedValue<string>;
  isChanging: SharedValue<boolean>;
  // registerField: (id: string, ref: FieldRef) => () => void;
  closeKeyboard: () => void;
  openKeyboard: () => void;
  isKeyboardOpened: SharedValue<boolean>;
  toggleHashState: () => void;
  hashState: SharedValue<HashToggleTypes>;
  keyboardHeight: SharedValue<number>;
};

export type HashToggleTypes =
  | "CAPITALIZE"
  | "UPPERCASE"
  | "LOWERCASE"
  | "NUMBERS";

export type PadProps = {
  padStyle?: StyleProp<ViewStyle>;
  keyStyle?: StyleProp<ViewStyle>;
  charStyle?: StyleProp<TextStyle>;
  letterStyle?: StyleProp<TextStyle>;
};
