import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import React, { useState } from "react";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useThemeColor } from "@/hooks/useThemeColor";

type TextProp = {
  digitHeight?: number;
  textStyle?: StyleProp<ViewStyle>;
  editing: SharedValue<boolean>;
  itemWidth: number;
};

type WheelInputProps = {
  value: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
  toFixedDigits?: number;
  showCurrencySymbol?: boolean;
  maxIntegerDigits?: number;
  initEditing?: boolean;
} & Partial<TextProp>;

const NUMBERS = Array.from({ length: 10 }, (_, i) => i);
const DIGIT_HEIGHT = 42;

const SPRING_CONFIG = {
  damping: 24,
  stiffness: 260,
  mass: 0.8,
  restDisplacementThreshold: 0.002,
  restSpeedThreshold: 0.002,
  overshootClamping: true,
};

const getStructure = (toFixedDigits = 2, maxIntegerDigits = 6) => {
  const digits: ("digit" | "comma" | "dot")[] = [];

  for (let i = maxIntegerDigits - 1; i >= 0; i--) {
    digits.push("digit");

    if (i % 3 === 0 && i !== 0) digits.push("comma");
  }

  digits.push("dot");

  for (let i = 0; i < toFixedDigits; i++) digits.push("digit");

  return digits;
};

const applySpring = (val: number) => {
  "worklet";
  return withSpring(val, SPRING_CONFIG);
};

export default function WheelNumberInput({
  value: v,
  style,
  toFixedDigits = 2,
  maxIntegerDigits = 6,
  showCurrencySymbol,
  editing,
  initEditing = false,
  itemWidth = 24,
  ...props
}: WheelInputProps) {
  const [splittedValue, setSplittedValue] = useState<string[]>([]);
  const value = useSharedValue(0);
  const isNegative = useDerivedValue(() => {
    return v.value < 0;
  });

  const STRUCTURE = getStructure(toFixedDigits, maxIntegerDigits);

  const formatValue = (value: number): string => {
    "worklet";
    const fixedValue =
      toFixedDigits !== undefined
        ? value.toFixed(toFixedDigits)
        : value.toString();
    return fixedValue;
  };

  useDerivedValue(() => {
    if (value.value !== v.value) {
      value.value = Math.abs(v.value);
    }
  });

  useAnimatedReaction(
    () => value.value,
    (v, prev) => {
      if (v === prev) return;
      const char = formatValue(v).split("");

      if (char !== splittedValue) {
        scheduleOnRN(setSplittedValue, char);
      }
    },
  );

  const dotIndex = STRUCTURE.indexOf("dot");
  const INTEGER_COLUMNS = STRUCTURE.map((t, i) =>
    t === "digit" && i < dotIndex ? i : -1,
  ).filter((i) => i !== -1);

  const DECIMAL_COLUMNS = STRUCTURE.map((t, i) =>
    t === "digit" && i > dotIndex ? i : -1,
  ).filter((i) => i !== -1);

  const isEditing = useDerivedValue<boolean>(() => {
    return editing ? editing.value : initEditing;
  });

  const colProps = {
    editing: isEditing,
    itemWidth,
  };

  return (
    <Animated.View style={[{ width: "100%" }, style, styles.container]}>
      {STRUCTURE.map((type, idx) => {
        const integerIndex =
          INTEGER_COLUMNS.indexOf(idx) !== -1
            ? INTEGER_COLUMNS.length - 1 - INTEGER_COLUMNS.indexOf(idx)
            : undefined;

        const decimalIndex =
          DECIMAL_COLUMNS.indexOf(idx) !== -1
            ? DECIMAL_COLUMNS.indexOf(idx)
            : undefined;

        const isDecimal = decimalIndex !== undefined;

        if (type === "comma")
          return (
            <ItemColumn type="comma" key={idx} value={value} {...colProps} />
          );
        if (type === "dot" && toFixedDigits > 0)
          return (
            <ItemColumn type="dot" key={idx} value={value} {...colProps} />
          );

        // return (

        // );
      })}
      <GradientY />
    </Animated.View>
  );
}

const GradientY = () => {
  const bg = useThemeColor("background");
  return (
    <View
      style={[
        styles.gradient,
        {
          experimental_backgroundImage: `linear-gradient(180deg, ${bg} 0%, ${bg} 25%, ${bg} 75%, ${bg} 100%)`,
        },
      ]}
    />
  );
};

type ColumnProps = {
  type: "digit" | "comma" | "dot" | "minus";
  value: SharedValue<number>;
} & TextProp;

const ItemColumn = ({ type, value, ...props }: ColumnProps) => {
  if (type === "comma") {
    return <Comma value={value} {...props} />;
  }

  return null;
};

const Comma = ({
  value,
  editing,
  itemWidth,
}: { value: SharedValue<number> } & TextProp) => {
  const isVisible = useDerivedValue(() => {
    const abs = Math.abs(value.value);
    const integerPart = Math.floor(abs);
    return integerPart >= 1000;
  });

  const animatedStyle = useAnimatedStyle(() => {
    const hidden = !isVisible.value && !editing.value;
    const opacity = isVisible.value ? 1 : editing.value ? 0.5 : 0;
    return {
      opacity: applySpring(opacity),
      width: applySpring(hidden ? 0 : itemWidth),
    };
  });

  return <Animated.Text style={[styles.text, animatedStyle]}>,</Animated.Text>;
};

const Dot = ({ value, editing }: { value: SharedValue<number> } & TextProp) => {
  const isVisible = useDerivedValue(() => {
    const abs = Math.abs(value.value);
    const decimalPart = abs - Math.floor(abs);
    return decimalPart > 0;
  });

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = isVisible.value ? 1 : editing?.value ? 0.5 : 0;
    return {
      opacity: applySpring(opacity),
    };
  });

  return <Animated.Text style={[styles.text, animatedStyle]}>,</Animated.Text>;
};

const styles = StyleSheet.create({
  column: {},
  gradient: {
    ...StyleSheet.absoluteFill,
  },
  container: {
    flexDirection: "row",
    overflow: "hidden",
  },
  text: {
    fontVariant: ["tabular-nums"],
  },
});
