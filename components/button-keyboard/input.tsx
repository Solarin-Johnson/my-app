import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { useButtonKeyboard } from "./provider";
import { useImperativeHandle } from "react";
import { ButtonKeyboardInputRef } from "./types";

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

  const { isChanging, value, closeKeyboard, openKeyboard } =
    useButtonKeyboard();
  const __inputValue = useSharedValue("");
  const inputValue = _inputValue || __inputValue;

  useAnimatedReaction(
    () => value.value,
    (val, prev) => {
      if (isChanging.value) {
        inputValue.value = inputValue.value.slice(0, -1) + val;
      } else {
        inputValue.set(inputValue.get() + val);
      }
    },
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      text: inputValue.value,
      value: inputValue.value,
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
