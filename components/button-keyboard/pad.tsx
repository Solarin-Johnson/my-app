import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useButtonKeyboard } from "./provider";

const KEY_HEIGHT = 50;
const GAP = 12;

const SYMBOLS = [".", ",", "?", "!", "@", "#"];

type KeyConfig = {
  number: string;
  letters: string[];
  removeLetters?: boolean;
};

const KEYS: KeyConfig[] = [
  { number: "1", letters: SYMBOLS, removeLetters: true },
  { number: "2", letters: ["A", "B", "C"] },
  { number: "3", letters: ["D", "E", "F"] },
  { number: "4", letters: ["G", "H", "I"] },
  { number: "5", letters: ["J", "K", "L"] },
  { number: "6", letters: ["M", "N", "O"] },
  { number: "7", letters: ["P", "Q", "R", "S"] },
  { number: "8", letters: ["T", "U", "V"] },
  { number: "9", letters: ["W", "X", "Y", "Z"] },
  { number: "*", letters: [] },
  { number: "0", letters: ["+"] },
  { number: "#", letters: [] },
];

export default function Pad() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.padContainer, { paddingBottom: bottom + GAP }]}>
      <View style={styles.keypad}>
        {KEYS.map((key, index) => (
          <Key
            key={index}
            letters={key.letters}
            number={key.number}
            removeLetters={key.removeLetters}
          />
        ))}
      </View>
    </View>
  );
}

const Key = ({ letters, number, removeLetters }: KeyConfig) => {
  const { width } = useWindowDimensions();
  const {} = useButtonKeyboard();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.keyButton, { width: (width - GAP * 4) / 3 }]}
    >
      <View style={styles.keyContent}>
        <Text style={styles.number}>{number}</Text>
        <View style={styles.letter}>
          {!removeLetters && (
            <Text style={styles.letters} numberOfLines={1}>
              {letters.length > 0 ? letters.join(" ") : " "}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
    letterSpacing: -2.5,
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
