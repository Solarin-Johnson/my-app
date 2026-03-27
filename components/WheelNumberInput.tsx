import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Animated, {
  scrollTo,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { runOnUI, scheduleOnRN, scheduleOnUI } from "react-native-worklets";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedTextWrapper } from "./ThemedText";

type TextProp = {
  digitHeight?: number;
  textStyle?: StyleProp<TextStyle>;
  editing: SharedValue<boolean>;
  size: number;
  reverse?: boolean;
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
const DIGIT_WIDTH_FACTOR = 0.65;

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
  size = 20,
  digitHeight = DIGIT_HEIGHT,
  reverse = true,
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
    size,
    digitHeight,
    reverse,
    ...props,
  };

  return (
    <Animated.View style={[style, { height: size }, styles.container]}>
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

        return (
          <ItemColumn
            type="digit"
            key={idx}
            value={value}
            {...colProps}
            isDecimal={isDecimal}
            index={isDecimal ? decimalIndex! : integerIndex!}
          />
        );
      })}
      {/* <GradientY /> */}
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
  isDecimal?: boolean;
  index?: number;
} & TextProp;

const ItemColumn = ({
  type,
  value,
  isDecimal,
  index,
  ...props
}: ColumnProps) => {
  if (type === "comma") {
    return <Comma value={value} {...props} />;
  }
  if (type === "dot") {
    return <Dot value={value} {...props} />;
  }
  if (type === "digit") {
    return (
      <DigitColumn
        value={value}
        {...props}
        isDecimal={isDecimal}
        index={index || 0}
      />
    );
  }

  return null;
};

const Comma = ({
  value,
  editing,
  size,
  textStyle,
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
      width: applySpring(hidden ? 0 : size / 5),
    };
  });

  return (
    <ThemedTextWrapper>
      <Animated.Text
        style={[styles.text, textStyle, { fontSize: size }, animatedStyle]}
      >
        ,
      </Animated.Text>
    </ThemedTextWrapper>
  );
};

const Dot = ({
  value,
  editing,
  size,
  textStyle,
}: { value: SharedValue<number> } & TextProp) => {
  const isVisible = useDerivedValue(() => {
    const abs = Math.abs(value.value);
    const decimalPart = abs - Math.floor(abs);
    return decimalPart > 0;
  });

  const animatedStyle = useAnimatedStyle(() => {
    const hidden = !isVisible.value && !editing.value;
    const opacity = isVisible.value ? 1 : editing.value ? 0.5 : 0;
    return {
      opacity: applySpring(opacity),
      width: applySpring(hidden ? 0 : size / 4),
    };
  });

  return (
    <ThemedTextWrapper>
      <Animated.Text
        style={[styles.text, textStyle, { fontSize: size }, animatedStyle]}
      >
        .
      </Animated.Text>
    </ThemedTextWrapper>
  );
};

const DigitColumn = ({
  value,
  editing,
  size,
  isDecimal,
  index,
  textStyle,
  reverse,
  digitHeight = DIGIT_HEIGHT,
}: {
  value: SharedValue<number>;
  isDecimal?: boolean;
  index: number;
} & TextProp) => {
  const scrollRef = useAnimatedRef();

  const currentDigit = useDerivedValue(() => {
    const EPS = 1e-8;
    const digit = isDecimal
      ? Math.floor((value.value + EPS) * Math.pow(10, index + 1)) % 10
      : Math.floor((value.value + EPS) / Math.pow(10, index)) % 10;

    return digit;
  });

  const isVisible = useDerivedValue(() => {
    if (isDecimal) return true;

    const abs = Math.abs(value.value);
    const digitValue = Math.floor(abs / Math.pow(10, index));

    return digitValue > 0 || index === 0;
  });

  const animatedStyle = useAnimatedStyle(() => {
    const hidden = !isVisible.value && !editing.value;
    const opacity = isVisible.value ? 1 : editing.value ? 0.5 : 0;
    console.log(currentDigit.value);

    return {
      opacity: applySpring(opacity),
      width: applySpring(hidden ? 0 : size * DIGIT_WIDTH_FACTOR),
      transform: [{ scale: applySpring(hidden ? 0 : 1) }],
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // const offsetY = event.contentOffset.y;
      // const rawIndex = Math.floor(offsetY / size + 0.5) % 10;
      // const digit = reverse ? 9 - rawIndex : rawIndex;
      // const abs = Math.abs(value.value);
      // const base =
      //   abs -
      //   (Math.floor(abs / Math.pow(10, index)) % 10) * Math.pow(10, index);
      // const newAbs = base + digit * Math.pow(10, index);
      // value.value = value.value < 0 ? -newAbs : newAbs;
      // console.log(value.value);
    },
  });

  const scrollAnimatedProps = useAnimatedProps(() => {
    const scrollY = currentDigit.value * size;
    return {
      contentOffset: { x: 0, y: scrollY },
    };
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <Animated.ScrollView
        style={[
          styles.column,
          { maxWidth: size * DIGIT_WIDTH_FACTOR, height: size },
        ]}
        showsVerticalScrollIndicator={false}
        snapToOffsets={NUMBERS.map((_, i) => i * size)}
        decelerationRate={"fast"}
        onScroll={scrollHandler}
        ref={scrollRef}
        animatedProps={scrollAnimatedProps}
      >
        {NUMBERS.map((num) => (
          <View
            key={num}
            style={{
              height: size,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ThemedTextWrapper key={num}>
              <Animated.Text
                style={[
                  styles.text,
                  textStyle,
                  { textAlign: "center", fontSize: size },
                ]}
              >
                {num}
              </Animated.Text>
            </ThemedTextWrapper>
          </View>
        ))}
      </Animated.ScrollView>
    </Animated.View>
  );
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
    fontSize: 32,
  },
});
