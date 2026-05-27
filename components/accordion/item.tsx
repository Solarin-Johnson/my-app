import { StyleSheet, Pressable } from "react-native";
import React from "react";
import { useAccordionContext } from "./provider";
import { ThemedText } from "../ThemedText";

export type ItemProps = {
  index?: number;
  children?: React.ReactNode;
};

export default function Item({ children, index = 0 }: ItemProps) {
  const { currentIndex, setCurrentIndex } = useAccordionContext();
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        setCurrentIndex(currentIndex === index ? null : index);
      }}
    >
      {children}
      <ThemedText>
        {currentIndex === index ? "Expanded" : "Collapsed"}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
