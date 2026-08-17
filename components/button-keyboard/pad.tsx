import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useButtonKeyboard } from "./provider";
import Animated, {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

const KEY_HEIGHT = 50;
const GAP = 12;
const TIMEOUT = 600;

const SYMBOLS = [".", ",", "?", "!", "@", "#"];

type KeyConfig = {
  letters: string[];
  removeLetters?: boolean;
  notCharacter?: boolean;
};

const KEYS: Record<string, KeyConfig> = {
  "1": { letters: SYMBOLS, removeLetters: true },
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

export default function Pad() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.padContainer, { paddingBottom: bottom + GAP }]}>
      <View style={styles.keypad}>
        {KEY_ORDER.map((number) => {
          const key = KEYS[number];

          return (
            <Key
              key={number}
              letters={key.letters}
              char={number}
              removeLetters={key.removeLetters}
            />
          );
        })}
      </View>
    </View>
  );
}

const Key = ({
  letters,
  char,
  removeLetters,
}: KeyConfig & { char: string }) => {
  const { width } = useWindowDimensions();
  const { value, isChanging } = useButtonKeyboard();
  const lastKey = useRef<string | undefined>(undefined);
  const lastTap = useRef(0);
  const index = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const v = useSharedValue("");
  const keyLetters = letters.filter((letter) => letter !== char);

  useAnimatedReaction(
    () => value.value,
    (val, prev) => {
      if (isChanging.value) {
        v.value = v.value.slice(0, -1) + val;
      } else {
        v.set(v.get() + val);
      }
      console.log(v.value);
    },
  );

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

    if (!letters || KEYS[key].notCharacter) return;

    if (key === lastKey.current && now - lastTap.current < TIMEOUT) {
      isChanging.set(true);
      index.current = (index.current + 1) % letters.length;
    } else {
      commitLetter();
      index.current = 0;
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

    value.set(letters[letters.length - 1]);
    setTimeout(() => {
      commitLetter();
    }, 1);
  };

  const subtext = keyLetters.length > 0 ? keyLetters.join("") : " ";

  return (
    <Pressable
      style={[styles.keyButton, { width: (width - GAP * 4) / 3 }]}
      onPress={handleKeyPress}
      onLongPress={onLongPress}
    >
      <View style={styles.keyContent}>
        <Text style={styles.number}>{char}</Text>
        <View style={styles.letter}>
          {!removeLetters && (
            <Text style={styles.letters} numberOfLines={1}>
              {subtext}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const fontFamily = Platform.select({
  ios: "ui-monospace",
  default: "monospace",
});

const styles = StyleSheet.create({
  padContainer: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: GAP,
    paddingTop: GAP,
    position: "absolute",
    bottom: 0,
    borderRadius: 24,
    borderCurve: "continuous",
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
    borderRadius: 12,
    borderCurve: "continuous",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
  },
  keyContent: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  letters: {
    fontSize: 13,
    opacity: 0.8,
    letterSpacing: 1.5,
    textAlign: "left",
    width: 48,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
    fontFamily: fontFamily,
  },
  number: {
    fontSize: 24,
    fontWeight: "500",
    color: "#111",
    width: 24,
    fontVariant: ["tabular-nums"],
    fontFamily: fontFamily,
  },
  letter: {
    width: 38,
    // backgroundColor: "red",
  },
});
