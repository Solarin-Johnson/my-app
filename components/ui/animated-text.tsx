import { TextInput } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";

import type { TextInputProps } from "react-native";

interface TextProps extends Omit<TextInputProps, "value"> {
  text: SharedValue<string> | SharedValue<number>;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const AnimatedText = (props: TextProps) => {
  const { text, ...rest } = props;

  const animatedProps = useAnimatedProps(() => {
    return {
      text: String(text.value),
    } as any;
  });

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={String(text.value)}
      {...rest}
      animatedProps={animatedProps}
    />
  );
};
