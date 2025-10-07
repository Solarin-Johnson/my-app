import { ReactElement, cloneElement, ComponentProps } from "react";
import { useStackedInput } from "./provider";

interface TriggerProps {
  type: "next" | "previous";
  children: ReactElement<ComponentProps<any> & { onPress?: () => void }>;
}

export default function Trigger({ type, children }: TriggerProps) {
  const { minIndex = 0, maxIndex = 1, currentIndex } = useStackedInput();

  const handleNext = () => {
    if (currentIndex.value < maxIndex) {
      currentIndex.value += 1;
    }
  };

  const handlePrevious = () => {
    if (currentIndex.value > minIndex) {
      currentIndex.value -= 1;
    }
  };

  return cloneElement(children, {
    onPress: () => {
      children.props.onPress?.();
      type === "next" ? handleNext() : handlePrevious();
    },
  });
}
