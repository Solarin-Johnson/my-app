import React, { useState } from "react";
import { GestureResponderEvent, Pressable, PressableProps } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const easing = Easing.inOut(Easing.ease);

interface PressableBounceProps extends PressableProps {
  children: React.ReactNode;
  bounceScale?: number;
  duration?: number;
}

const PressableBounce: React.FC<PressableBounceProps> = ({
  children,
  bounceScale = 0.95,
  duration = 150,
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = (event: GestureResponderEvent) => {
    scale.value = withTiming(bounceScale, {
      duration,
      easing,
    });
    props.onPressIn && props.onPressIn(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    scale.value = withSpring(1);
    props.onPressOut && props.onPressOut(event);
  };

  return (
    <AnimatedPressable
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, props.style]}
    >
      {children}
    </AnimatedPressable>
  );
};

export default PressableBounce;
