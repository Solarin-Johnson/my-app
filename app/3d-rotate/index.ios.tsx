import React from "react";
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import { Host, HStack, Slider } from "@expo/ui/swift-ui";
import Index from "./default";

const AnimatedSlider = Animated.createAnimatedComponent(Slider);

export default function IosIndex() {
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    value: progress.value,
  }));

  return (
    <Index progress={progress}>
      <Host matchContents style={{ minHeight: 80, width: 250 }}>
        <HStack>
          <AnimatedSlider
            min={0}
            max={1}
            steps={0.01}
            animatedProps={animatedProps}
            onValueChange={(value) => {
              progress.value = value;
            }}
          />
        </HStack>
      </Host>
    </Index>
  );
}
