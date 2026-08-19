import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";
import { FieldRef, useButtonKeyboard } from "./provider";
import { useFocusEffect } from "expo-router";
import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from "react";
import { ButtonKeyboardInputRef } from "./types";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type ButtonKeyboardInputProps = TextInputProps & {
  ref?: React.RefObject<ButtonKeyboardInputRef>;
};

export default function Input({
  style,
  ref: inputRef,
  ...props
}: ButtonKeyboardInputProps) {
  const ref = useAnimatedRef<TextInput>();

  const { isChanging, value, closeKeyboard, openKeyboard } =
    useButtonKeyboard();
  const inputVal = useSharedValue("");

  useAnimatedReaction(
    () => value.value,
    (val, prev) => {
      if (isChanging.value) {
        inputVal.value = inputVal.value.slice(0, -1) + val;
      } else {
        inputVal.set(inputVal.get() + val);
      }
    },
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      text: inputVal.value,
    } as any;
  });

  const focus = () => {
    openKeyboard();
  };
  const blur = () => {
    closeKeyboard();
  };
  const deleteChar = () => {
    inputVal.set(inputVal.get().slice(0, -1));
  };
  const deleteAll = () => {
    inputVal.set("");
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
