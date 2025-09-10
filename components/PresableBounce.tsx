import React, { useState } from "react";
import { GestureResponderEvent, Pressable, PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableBounceProps extends PressableProps {
  children: React.ReactNode;
  bounceScale?: number;
  duration?: number;
  propagateEvent?: boolean;
}

const PressableBounce: React.FC<PressableBounceProps> = ({
  children,
  bounceScale = 0.95,
  duration = 150,
  propagateEvent = false,
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = (event: GestureResponderEvent) => {
    if (!propagateEvent) {
      event.stopPropagation();
    }
    scale.value = withTiming(bounceScale, { duration });
    props.onPressIn && props.onPressIn(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    if (!propagateEvent) {
      event.stopPropagation();
    }
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
