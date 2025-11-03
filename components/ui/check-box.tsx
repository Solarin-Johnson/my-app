import React, { useEffect } from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Entypo } from "@expo/vector-icons";

interface CheckBoxProps {
  checkedColor?: string;
  initialColor?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
  checkedColor = "#4F46E5",
  initialColor = "#D1D5DB",
  checked,
  onChange,
  size = 24,
  style,
}) => {
  const checkedSV = useSharedValue(checked ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    checkedSV.value = withTiming(checked ? 1 : 0, { duration: 200 });
  }, [checked, checkedSV]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      checkedSV.value,
      [0, 1],
      [initialColor, checkedColor]
    ),
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkedSV.value,
  }));

  const handlePress = () => {
    if (checked === undefined) {
      checkedSV.value = withTiming(checkedSV.value ? 0 : 1, { duration: 200 });
      if (onChange) scheduleOnRN(() => onChange(!checkedSV.value));
    } else {
      if (onChange) scheduleOnRN(() => onChange(!checked));
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.8);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.box,
          {
            width: size,
            height: size,
            borderRadius: size * 0.25,
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
    </Pressable>
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
