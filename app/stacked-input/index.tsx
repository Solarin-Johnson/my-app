import { View, Text, Button, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stacked } from "@/components/stacked-input";
import { useSharedValue } from "react-native-reanimated";
import { KeyboardToolbar } from "react-native-keyboard-controller";

export default function Index() {
  const currentIndex = useSharedValue(0);

  return (
    <>
      <ScrollView
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView style={{ flex: 1, padding: 36 }}>
          <Stacked.Provider currentIndex={currentIndex}>
            <Stacked.Input index={0} />
            <Stacked.Input
              index={1}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Stacked.Input index={2} />
            <Stacked.Input index={3} />
            <Stacked.Input index={4} />
          </Stacked.Provider>
          <Stacked.Trigger type="next" currentIndex={currentIndex} max={4}>
            <Button title="Next" />
          </Stacked.Trigger>
          <Stacked.Trigger type="previous" currentIndex={currentIndex}>
            <Button title="Previous" />
          </Stacked.Trigger>
        </SafeAreaView>
      </ScrollView>
      <KeyboardToolbar />
    </>
  );
}
