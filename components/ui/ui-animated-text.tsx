import { SharedValue, useAnimatedReaction } from "react-native-reanimated";
import { Host, Text, TextFieldProps } from "@expo/ui/swift-ui";
import { useState } from "react";
import { runOnJS } from "react-native-worklets";
import {
  Animation,
  animation,
  contentTransition,
  font,
  frame,
} from "@expo/ui/swift-ui/modifiers";

interface TextProps extends Omit<TextFieldProps, "value"> {
  text: SharedValue<string> | SharedValue<number>;
}

export const UIAnimatedText = (props: TextProps) => {
  const { text, modifiers, ...rest } = props;

  const [val, setVal] = useState<number>(0);

  useAnimatedReaction(
    () => text.value,
    (v) => {
      runOnJS(setVal)(Number(v));
    },
  );

  return (
    <Host
      matchContents
      style={{
        width: 82,
      }}
    >
      <Text
        modifiers={[
          font({ size: 16, weight: "semibold", design: "rounded" }),
          contentTransition("numericText"),
          animation(
            Animation.spring({ response: 0.5, dampingFraction: 0.9 }),
            val,
          ),
          frame({ maxWidth: 42 }),
          ...(modifiers ?? []),
        ]}
        countsDown={false}
        {...rest}
      >
        {val.toFixed(1) + "x"}
      </Text>
      {/* <LoopingIcon /> */}
    </Host>
  );
};
