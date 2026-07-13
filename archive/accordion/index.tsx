import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Accordion } from "@/components/accordion";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccordionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>AccordionScreen</Text>
      <Accordion useDefaultStyles>
        <Accordion.Item />
        <Accordion.Item />
        <Accordion.Item />
      </Accordion>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
