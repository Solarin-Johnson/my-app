import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  withSpring,
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Entypo } from "@expo/vector-icons";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ANIMATION_DURATION = 200;
const SPRING_SCALE = 0.8;
const DEFAULT_COLORS = {
  checked: "#4F46E5",
  initial: "#D1D5DB",
  disabled: "#9CA3AF",
};

const interpolateDisabledColor = (
  disabledValue: number,
  activeColor: string,
  disabledColor: string
) => {
  "worklet";
  return interpolateColor(disabledValue, [0, 1], [activeColor, disabledColor]);
};

interface CheckBoxProps {
  checkedColor?: string;
  initialColor?: string;
  disabledColor?: string;
  checked?: SharedValue<boolean>;
  onChange?: (checked: boolean) => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: SharedValue<boolean>;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
  checkedColor = DEFAULT_COLORS.checked,
  initialColor = DEFAULT_COLORS.initial,
  disabledColor = DEFAULT_COLORS.disabled,
  checked,
  onChange,
  size = 24,
  style,
  disabled,
}) => {
  const checkedSV = useSharedValue(0);
  const scale = useSharedValue(1);
  const disabledSV = useSharedValue(0);

  const handleAnimatedReaction = (
    sharedValue: SharedValue<number>,
    value: boolean
  ) => {
    "worklet";
    sharedValue.value = withTiming(value ? 1 : 0, {
      duration: ANIMATION_DURATION,
    });
  };

  useAnimatedReaction(
    () => checked?.value ?? false,
    (current, previous) => {
      if (current !== previous) {
        handleAnimatedReaction(checkedSV, current);
      }
    }
  );

  useAnimatedReaction(
    () => disabled?.value ?? false,
    (current, previous) => {
      if (current !== previous) {
        handleAnimatedReaction(disabledSV, current);
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    const colorFrom = interpolateDisabledColor(
      disabledSV.value,
      initialColor,
      disabledColor
    );
    const colorTo = interpolateDisabledColor(
      disabledSV.value,
      checkedColor,
      disabledColor
    );

    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        checkedSV.value,
        [0, 1],
        [colorFrom, colorTo]
      ),
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkedSV.value,
  }));

  const isDisabled = useDerivedValue(() => disabledSV.value === 1);

  const handlePress = () => {
    if (isDisabled.value) return;

    if (!checked) {
      checkedSV.value = withTiming(checkedSV.value ? 0 : 1, {
        duration: ANIMATION_DURATION,
      });
      if (onChange) scheduleOnRN(() => onChange(!checkedSV.value));
    } else {
      if (onChange) scheduleOnRN(() => onChange(!checked.value));
    }
  };

  const handlePressIn = () => {
    if (isDisabled.value) return;
    scale.value = withSpring(SPRING_SCALE);
  };

  const handlePressOut = () => {
    if (isDisabled.value) return;
    scale.value = withSpring(1);
  };

  const pressableAnimatedProps = useAnimatedProps(() => ({
    disabled: isDisabled.value,
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      animatedProps={pressableAnimatedProps}
    >
      <Animated.View
        style={[
          styles.box,
          {
            width: size,
            height: size,
            borderRadius: size * 0.3,
          },
          style,
          animatedStyle,
        ]}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.centered, iconAnimatedStyle]}
          pointerEvents="none"
        >
          <Entypo name="check" size={size * 0.7} color="#fff" />
        </Animated.View>
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 6,
    borderCurve: "continuous",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CheckBox;
