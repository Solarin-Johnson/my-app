import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useButtonKeyboard } from "./provider";
import { useImperativeHandle } from "react";
import { ButtonKeyboardInputRef, HashToggleTypes } from "./types";
import { point } from "@shopify/react-native-skia";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type ButtonKeyboardInputProps = TextInputProps & {
  ref?: React.RefObject<ButtonKeyboardInputRef>;
  inputValue?: SharedValue<string>;
  fixedPretext?: string;
};

export default function Input({
  style,
  ref: inputRef,
  inputValue: _inputValue,
  fixedPretext,
  ...props
}: ButtonKeyboardInputProps) {
  const ref = useAnimatedRef<TextInput>();

  const { isChanging, value, closeKeyboard, openKeyboard, hashState } =
    useButtonKeyboard();
  const __inputValue = useSharedValue("");
  const inputValue = _inputValue || __inputValue;
  const isFocused = useSharedValue(false);

  const applyHashState = (value: string, state: HashToggleTypes) => {
    "worklet";
    if (state === "UPPERCASE") {
      return value.toUpperCase();
    }
    if (state === "LOWERCASE") {
      return value.toLowerCase();
    }
    if (state === "CAPITALIZE") {
      const input = inputValue.value;
      const length = input.length;

      const shouldCapitalize =
        input.endsWith(" ") ||
        (isChanging.value && (input[length - 2] === " " || length === 1)) ||
        (!isChanging.value && length === 0);

      return shouldCapitalize ? value.toUpperCase() : value.toLowerCase();
    }

    return value;
  };

  useAnimatedReaction(
    () => value.value,
    (val, prev) => {
      if (!isFocused.value) return;

      if (isChanging.value) {
        inputValue.value =
          inputValue.value.slice(0, -1) + applyHashState(val, hashState.value);
      } else {
        inputValue.set(inputValue.get() + applyHashState(val, hashState.value));
      }
    },
  );

  const animatedProps = useAnimatedProps(() => {
    const v = inputValue.value;
    const pre = fixedPretext ? fixedPretext : "";
    const val = v === "" || !fixedPretext ? v : pre + v;
    return {
      text: val,
      value: val,
    } as any;
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: isFocused.value ? "none" : "auto",
    };
  });

  const onFocus = () => {
    isFocused.set(true);
    openKeyboard();
  };

  const onBlur = () => {
    isFocused.set(false);
    closeKeyboard();
  };

  const focus = () => {
    ref.current?.focus();
  };
  const blur = () => {
    ref.current?.blur();
  };
  const deleteChar = () => {
    inputValue.set(inputValue.get().slice(0, -1));
    isChanging.set(false);
    value.set("");
  };
  const deleteAll = () => {
    inputValue.set("");
    isChanging.set(false);
    value.set("");
  };

  useImperativeHandle(inputRef, () => ({
    focus,
    blur,
    delete: deleteChar,
    deleteAll,
  }));

  return (
    <AnimatedTextInput
      multiline
      {...props}
      ref={ref}
      underlineColorAndroid="transparent"
      // editable={false}
      // pointerEvents={"none"}
      animatedProps={animatedProps}
      caretHidden={true}
      showSoftInputOnFocus={false}
      selectTextOnFocus={false}
      contextMenuHidden={true}
      autoCorrect={false}
      style={[styles.input, style]}
      onFocus={onFocus}
      onBlur={onBlur}
      keyboardType="web-search"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minWidth: "100%",
  },
});
