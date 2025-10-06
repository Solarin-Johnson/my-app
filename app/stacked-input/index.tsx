import { Button } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stacked } from "@/components/stacked-input";
import { useSharedValue } from "react-native-reanimated";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Index() {
  const currentIndex = useSharedValue(0);

  const text = useThemeColor("text");
  const bg = useThemeColor("background");

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <>
      <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          padding: 36,
          justifyContent: "center",
        }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Stacked.Provider currentIndex={currentIndex}>
          <Stacked.Input index={0} />
          <Stacked.Input
            index={1}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Stacked.Input index={2}>
            <Stacked.Switch
              title="Send a reminder in 5 days"
              textProps={{
                style: {
                  color: "#888888",
                  letterSpacing: -0.1,
                  fontSize: 16,
                },
                type: "defaultSemiBold",
              }}
              trackColor={{ true: text }}
              thumbColor={bg}
              value={isEnabled}
              onValueChange={toggleSwitch}
            />
          </Stacked.Input>
        </Stacked.Provider>
        <Stacked.Trigger type="next" currentIndex={currentIndex} max={2}>
          <Button title="Next" />
        </Stacked.Trigger>
        <Stacked.Trigger type="previous" currentIndex={currentIndex}>
          <Button title="Previous" />
        </Stacked.Trigger>
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
}
