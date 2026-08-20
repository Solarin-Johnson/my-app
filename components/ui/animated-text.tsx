import { TextInput } from "react-native";
import Animated, {
  isSharedValue,
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";

import type { TextInputProps } from "react-native";

interface TextProps extends Omit<TextInputProps, "value"> {
  text: SharedValue<string> | SharedValue<number> | string | number;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const AnimatedText = (props: TextProps) => {
  const { text, ...rest } = props;
  const textValue = isSharedValue(text) ? String(text.value) : String(text);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: isSharedValue(text) ? text.value : textValue,
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
