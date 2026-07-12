import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  WithSpringConfig,
  WithTimingConfig,
  withTiming,
} from "react-native-reanimated";

interface UIConditionalRenderProps {
  elements: React.ReactNode[];
  currentIndex?: SharedValue<number>;
  initCurrentIndex?: number;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  animationType?: "spring" | "timing";
  animationConfig?: WithSpringConfig | WithTimingConfig;
  sharedAnimationConfig?:
    | SharedValue<WithSpringConfig>
    | SharedValue<WithTimingConfig>;
}

interface UIConditionalRenderItemProps {
  element: React.ReactNode;
  index: number;
  isLast: boolean;
  style?: StyleProp<ViewStyle>;
  currentIndex: SharedValue<number>;
  animationType: "spring" | "timing";
  animationConfig: SharedValue<WithSpringConfig | WithTimingConfig | undefined>;
}

export const UIConditionalRender: React.FC<UIConditionalRenderProps> = ({
  elements,
  currentIndex: _currentIndex,
  initCurrentIndex = 1,
  style,
  itemStyle,
  animationType = "timing",
  animationConfig,
  sharedAnimationConfig,
}) => {
  const currentIndex = useDerivedValue(() => {
    return _currentIndex?.value ?? initCurrentIndex;
  });

  const effectiveAnimationConfig = useDerivedValue(() => {
    return sharedAnimationConfig?.value ?? animationConfig;
  });

  return (
    <View style={style}>
      {elements.map((element, index) => (
        <UIConditionalRenderItem
          key={index}
          element={element}
          index={index + 1}
          isLast={index === elements.length - 1}
          style={itemStyle}
          currentIndex={currentIndex}
          animationType={animationType}
          animationConfig={effectiveAnimationConfig}
        />
      ))}
    </View>
  );
};

const UIConditionalRenderItem: React.FC<UIConditionalRenderItemProps> = ({
  element,
  index,
  isLast,
  style,
  currentIndex,
  animationType,
  animationConfig,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const targetOpacity = currentIndex.value === index ? 1 : 0;

    return {
      opacity:
        animationType === "spring"
          ? withSpring(
              targetOpacity,
              animationConfig.value as WithSpringConfig | undefined,
            )
          : withTiming(
              targetOpacity,
              (animationConfig.value as WithTimingConfig | undefined) || {
                duration: 250,
                easing: Easing.out(Easing.ease),
              },
            ),
    };
  });

  return (
    <Animated.View
      style={[animatedStyle, style, index > 1 ? styles.container : undefined]}
    >
      {element}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
});
