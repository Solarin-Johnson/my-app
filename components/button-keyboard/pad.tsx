import React, { RefObject, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useButtonKeyboard } from "./provider";
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  GestureDetector,
  useLongPressGesture,
  useSimultaneousGestures,
  useTapGesture,
} from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { PadProps } from "./types";

const KEY_HEIGHT = 54;
const GAP = 2.5;
const TIMEOUT = 600;

const SYMBOLS = [".", ",", "?", "!", "@", "#"];

type KeyConfig = {
  letters: string[];
  removeLetters?: boolean;
  notCharacter?: boolean;
  maxNumberOfLetters?: number;
};

const KEYS: Record<string, KeyConfig> = {
  "1": { letters: SYMBOLS, maxNumberOfLetters: 1 },
  "2": { letters: ["A", "B", "C", "2"] },
  "3": { letters: ["D", "E", "F", "3"] },
  "4": { letters: ["G", "H", "I", "4"] },
  "5": { letters: ["J", "K", "L", "5"] },
  "6": { letters: ["M", "N", "O", "6"] },
  "7": { letters: ["P", "Q", "R", "S", "7"] },
  "8": { letters: ["T", "U", "V", "8"] },
  "9": { letters: ["W", "X", "Y", "Z", "9"] },
  "*": { letters: [], notCharacter: true },
  "0": { letters: [" ", "0", "+"] },
  "#": { letters: [], notCharacter: true },
};

const KEY_ORDER = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

export const SPRING_CONFIG = {
  stiffness: 175,
  damping: 32,
  mass: 0.5,
  overshootClamping: true,
  restSpeedThreshold: 0.0001,
  restDisplacementThreshold: 0.0001,
};

export default function Pad({
  padStyle,
  keyStyle,
  charStyle,
  letterStyle,
}: PadProps) {
  const { bottom } = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { isKeyboardOpened, keyboardHeight } = useButtonKeyboard();
  const ref = useAnimatedRef<View>();
  const lastKey = useRef<string | undefined>(undefined);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTap = useRef(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // transform: [{ translateY: isKeyboardOpened.value ? 0 : height.value }],
      top: withSpring(
        isKeyboardOpened.value
          ? windowHeight - keyboardHeight.value
          : windowHeight,
        SPRING_CONFIG,
      ),
    };
  });

  useDerivedValue(() => {
    if (ref) {
      const measurement = measure(ref);
      if (measurement) {
        keyboardHeight.set(measurement.height);
      }
    }
  });

  return (
    <Animated.View
      style={[
        styles.padDefaultStyle,
        padStyle,
        styles.padContainer,
        { paddingBottom: bottom + GAP },
        animatedStyle,
      ]}
      ref={ref}
    >
      <View style={styles.keypad}>
        {KEY_ORDER.map((number) => {
          const key = KEYS[number];

          return (
            <Key
              key={number}
              letters={key.letters}
              char={number}
              removeLetters={key.removeLetters}
              lastKey={lastKey}
              timer={timer}
              lastTap={lastTap}
              keyStyle={keyStyle}
              charStyle={charStyle}
              letterStyle={letterStyle}
              maxNumberOfLetters={key.maxNumberOfLetters}
            />
          );
        })}
      </View>
      <View
        style={[
          styles.keyButton,
          keyStyle,
          styles.bottomBar,
          { height: bottom },
        ]}
      />
    </Animated.View>
  );
}

type KeyProps = KeyConfig &
  Pick<PadProps, "keyStyle" | "charStyle" | "letterStyle"> & {
    char: string;
    lastKey: React.RefObject<string | undefined>;
    timer: RefObject<ReturnType<typeof setTimeout> | null>;
    lastTap: RefObject<number>;
  };

const Key = ({
  letters,
  char,
  removeLetters,
  lastKey,
  timer,
  lastTap,
  keyStyle,
  charStyle,
  letterStyle,
  maxNumberOfLetters,
}: KeyProps) => {
  const { width } = useWindowDimensions();
  const { value, isChanging, toggleHashState, hashState } = useButtonKeyboard();
  const index = useRef(0);
  const tapIn = useSharedValue(false);

  const keyLetters = letters.filter((letter) => letter !== char);

  const commitLetter = () => {
    if (!value.value) return;
    isChanging.set(false);
    value.set("");
    lastKey.current = undefined;
    index.current = 0;
  };

  const handleKeyPress = () => {
    const key = char;
    const now = Date.now();
    const letters = KEYS[key].letters;
    tapIn.set(true);

    if (!letters || KEYS[key].notCharacter) {
      if (char === "#") {
        toggleHashState();
      }
      return;
    }

    if (hashState.value === "NUMBERS") {
      isChanging.set(false);
      value.set(key);
      setTimeout(() => {
        commitLetter();
      }, 1);
      return;
    }

    if (key === lastKey.current && now - lastTap.current < TIMEOUT) {
      isChanging.set(true);
      index.current = (index.current + 1) % letters.length;
    } else {
      commitLetter();
    }
    value.set(letters[index.current]);

    lastKey.current = key;
    lastTap.current = now;

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      commitLetter();
    }, TIMEOUT);
  };

  const onLongPress = () => {
    if (!letters || KEYS[char].notCharacter) return;
    isChanging.set(true);
    value.set(char);
    setTimeout(() => {
      commitLetter();
    }, 1);
  };

  const tapGesture = useTapGesture({
    onTouchesDown: () => {
      scheduleOnRN(handleKeyPress);
    },
    onDeactivate: () => {
      tapIn.set(false);
    },
  });

  const longPressGesture = useLongPressGesture({
    onActivate: () => {
      scheduleOnRN(onLongPress);
    },
    onFinalize: () => {
      tapIn.set(false);
    },
  });

  const gesture = useSimultaneousGestures(tapGesture, longPressGesture);

  const visibleLetters = maxNumberOfLetters
    ? keyLetters.slice(0, maxNumberOfLetters)
    : keyLetters;
  const subtext = visibleLetters.length > 0 ? visibleLetters.join("") : " ";

  const animatedKeyStyle = useAnimatedStyle(() => {
    return {
      opacity: tapIn.value ? 0.7 : 1,
      transform: [
        {
          scale: withSpring(tapIn.value ? 0.98 : 1, SPRING_CONFIG),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.keyButton,
          keyStyle,
          { width: (width - GAP * 4) / 3 },
          animatedKeyStyle,
        ]}
      >
        <View style={styles.keyContent}>
          <Text style={[styles.number, charStyle]}>{char}</Text>
          <View style={styles.letter}>
            {!removeLetters && (
              <Text
                style={[styles.letters, charStyle, letterStyle]}
                numberOfLines={1}
              >
                {subtext}
              </Text>
            )}
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const fontFamily = Platform.select({
  ios: "ui-monospace",
  default: "monospace",
});

const styles = StyleSheet.create({
  padContainer: {
    width: "100%",
    position: "absolute",
    paddingHorizontal: GAP,
    paddingTop: GAP,
    overflow: "hidden",
  },
  padDefaultStyle: {
    backgroundColor: "#f5f5f5",
    // borderRadius: 24,
    // borderCurve: "continuous",
  },
  keypad: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: GAP,
  },
  keyButton: {
    height: KEY_HEIGHT,
    // borderRadius: 12,
    // borderCurve: "continuous",
    backgroundColor: "#888888",
    justifyContent: "center",
    alignItems: "center",
  },
  keyContent: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  letters: {
    fontSize: 18,
    opacity: 0.8,
    letterSpacing: 1.5,
    textAlign: "left",
    width: 52,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
    fontFamily: fontFamily,
    color: "#fff",
  },
  number: {
    fontSize: 24,
    fontWeight: "500",
    color: "#fff",
    width: 24,
    fontVariant: ["tabular-nums"],
    fontFamily: fontFamily,
  },
  letter: {
    width: 38,
    // backgroundColor: "red",
  },
  bottomBar: {
    ...StyleSheet.absoluteFill,
    top: "auto",
  },
});
