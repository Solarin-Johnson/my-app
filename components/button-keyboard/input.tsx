import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";
import { FieldRef, useButtonKeyboard } from "./provider";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useId, useRef } from "react";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type ButtonKeyboardInputProps = TextInputProps & {};

export default function Input({ style, ...props }: ButtonKeyboardInputProps) {
  const inputVal = useSharedValue("");
  const { isChanging, value, closeKeyboard, openKeyboard } =
    useButtonKeyboard();

  const ref = useAnimatedRef<TextInput>();

  useAnimatedReaction(
    () => value.value,
    (val, prev) => {
      if (isChanging.value) {
        inputVal.value = inputVal.value.slice(0, -1) + val;
      } else {
        inputVal.set(inputVal.get() + val);
      }
      console.log(inputVal.value);
    },
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      text: inputVal.value,
    } as any;
  });

  useFocusEffect(
    useCallback(() => {
      inputVal.value = "";
      value.value = "";
      isChanging.value = false;
    }, []),
  );

  return (
    <AnimatedTextInput
      {...props}
      ref={ref}
      underlineColorAndroid="transparent"
      editable={false}
      pointerEvents={"none"}
      animatedProps={animatedProps}
      style={[styles.input, style]}
      multiline
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minWidth: "100%",
  },
});
