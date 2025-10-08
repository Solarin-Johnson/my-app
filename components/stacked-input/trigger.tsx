import React, {
  ReactElement,
  cloneElement,
  ComponentProps,
  isValidElement,
} from "react";
import { Pressable, PressableProps } from "react-native";
import { useStackedInput } from "./provider";

interface TriggerProps extends Omit<PressableProps, "onPress"> {
  type: "next" | "previous";
  asChild?: boolean;
  children: ReactElement<ComponentProps<typeof Pressable>>;
}

export default function Trigger({
  type,
  asChild,
  children,
  ...props
}: TriggerProps) {
  const { currentIndex, minIndex = 0, maxIndex = 1 } = useStackedInput();

  const handlePress = () => {
    if (type === "next") {
      if (currentIndex.value < maxIndex) {
        currentIndex.value += 1;
      }
    } else {
      if (currentIndex.value > minIndex) {
        currentIndex.value -= 1;
      }
    }
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      onPress: () => {
        (children.props as { onPress?: () => void }).onPress?.();
        handlePress();
      },
    });
  }

  return (
    <Pressable {...props} onPress={handlePress}>
      {children}
    </Pressable>
  );
}
