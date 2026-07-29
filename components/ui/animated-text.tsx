import { TextInput } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";

import type { TextInputProps } from "react-native";

interface TextProps extends Omit<TextInputProps, "value"> {
  text: SharedValue<string> | SharedValue<number> | string | number;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const isSharedValue = (
  text: TextProps["text"],
): text is SharedValue<string> | SharedValue<number> => {
  return typeof text === "object" && text !== null && "value" in text;
};

export const AnimatedText = (props: TextProps) => {
  const { text, ...rest } = props;
  const textValue = isSharedValue(text)
    ? String((text as SharedValue<string | number>).value)
    : String(text);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: textValue,
    } as any;
  });

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={textValue}
      pointerEvents={"none"}
      {...rest}
      animatedProps={animatedProps}
    />
  );
};
