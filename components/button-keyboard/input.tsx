import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { useButtonKeyboard } from "./provider";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type ButtonKeyboardInputProps = TextInputProps & {};

export default function Input({ style, ...props }: ButtonKeyboardInputProps) {
  const inputVal = useSharedValue("");
  const { isChanging, value } = useButtonKeyboard();

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
