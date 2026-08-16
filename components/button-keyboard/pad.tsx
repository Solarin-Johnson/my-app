import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const KEY_HEIGHT = 50;

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
    <View style={[styles.padContainer, { paddingBottom: bottom }]}>
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
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.keyButton}>
      <View style={styles.keyContent}>
        <Text style={styles.number}>{number}</Text>
        <View>
          {!removeLetters && (
            <Text style={styles.letters}>
              {letters.length > 0 ? letters.join(" ") : " "}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  padContainer: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  keypad: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  keyButton: {
    width: "30%",
    height: KEY_HEIGHT,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  keyContent: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  letters: {
    fontSize: 10,
    color: "#666",
    minHeight: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  number: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111",
  },
  letter: {},
});
