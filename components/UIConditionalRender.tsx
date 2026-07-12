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
}

interface UIConditionalRenderItemProps {
  element: React.ReactNode;
  index: number;
  isLast: boolean;
  style?: StyleProp<ViewStyle>;
  currentIndex: SharedValue<number>;
  animationType: "spring" | "timing";
  animationConfig?: WithSpringConfig | WithTimingConfig;
}

export const UIConditionalRender: React.FC<UIConditionalRenderProps> = ({
  elements,
  currentIndex: _currentIndex,
  initCurrentIndex = 1,
  style,
  itemStyle,
  animationType = "timing",
  animationConfig,
}) => {
  const currentIndex = useDerivedValue(() => {
    return _currentIndex?.value ?? initCurrentIndex;
  });

  return (
    <View style={style}>
      {elements.map((element, index) => (
        <UIConditionalRenderItem
          key={index}
          element={element}
          index={index}
          isLast={index === elements.length - 1}
          style={itemStyle}
          currentIndex={currentIndex}
          animationType={animationType}
          animationConfig={animationConfig}
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
              animationConfig as WithSpringConfig | undefined,
            )
          : withTiming(
              targetOpacity,
              (animationConfig as WithTimingConfig | undefined) || {
                duration: 250,
                easing: Easing.out(Easing.ease),
              },
            ),
    };
  });

  return (
    <Animated.View
      style={[animatedStyle, style, index > 0 ? styles.container : undefined]}
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
