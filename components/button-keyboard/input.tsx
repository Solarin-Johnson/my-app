import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { useButtonKeyboard } from "./provider";
import { useImperativeHandle } from "react";
import { ButtonKeyboardInputRef, HashToggleTypes } from "./types";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type ButtonKeyboardInputProps = TextInputProps & {
  ref?: React.RefObject<ButtonKeyboardInputRef>;
  inputValue?: SharedValue<string>;
};

export default function Input({
  style,
  ref: inputRef,
  inputValue: _inputValue,
  ...props
}: ButtonKeyboardInputProps) {
  // const ref = useAnimatedRef<TextInput>();

  const { isChanging, value, closeKeyboard, openKeyboard, hashState } =
    useButtonKeyboard();
  const __inputValue = useSharedValue("");
  const inputValue = _inputValue || __inputValue;

  const applyHashState = (value: string, state: HashToggleTypes) => {
    "worklet";
    if (state === "CAPITALIZE") {
      if (inputValue.value.length === 0) {
        return value.toUpperCase();
      } else {
        return value.toLowerCase();
      }
    } else if (state === "UPPERCASE") {
      return value.toUpperCase();
    } else if (state === "LOWERCASE") {
      return value.toLowerCase();
    }
    return value;
  };

  useAnimatedReaction(
    () => value.value,
    (val, prev) => {
      console.log(hashState.value);

      if (isChanging.value) {
        inputValue.value =
          inputValue.value.slice(0, -1) + applyHashState(val, hashState.value);
      } else {
        inputValue.set(inputValue.get() + applyHashState(val, hashState.value));
      }
    },
  );

  const animatedProps = useAnimatedProps(() => {
    const val = inputValue.value;
    return {
      text: val,
      value: val,
    } as any;
  });

  const focus = () => {
    openKeyboard();
  };
  const blur = () => {
    closeKeyboard();
  };
  const deleteChar = () => {
    inputValue.set(inputValue.get().slice(0, -1));
  };
  const deleteAll = () => {
    inputValue.set("");
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
      // ref={ref}
      underlineColorAndroid="transparent"
      editable={false}
      pointerEvents={"none"}
      animatedProps={animatedProps}
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minWidth: "100%",
  },
});
