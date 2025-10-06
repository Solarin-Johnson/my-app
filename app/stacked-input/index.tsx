import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stacked } from "@/components/stacked-input";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/Button";

export default function Index() {
  const currentIndex = useSharedValue(0);

  return (
    <>
      <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        // contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          Invite your friends
        </ThemedText>
        <StackInputContainer currentIndex={currentIndex} />
        <StackControl currentIndex={currentIndex} />
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
}

const StackInputContainer = ({
  currentIndex,
}: {
  currentIndex: SharedValue<number>;
}) => {
  const text = useThemeColor("text");
  const bg = useThemeColor("background");

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.stack}>
      <Stacked.Provider
        currentIndex={currentIndex}
        itemStyles={{ borderColor: text + "25", borderWidth: 1.4 }}
        itemProps={{ selectionColor: text }}
      >
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
    </View>
  );
};

const StackControl = ({
  currentIndex,
}: {
  currentIndex: SharedValue<number>;
}) => {
  return (
    <View style={styles.controlContainer}>
      <Stacked.Trigger type="previous" currentIndex={currentIndex}>
        <Button title="Previous" />
      </Stacked.Trigger>
      <Stacked.Trigger type="next" currentIndex={currentIndex} max={2}>
        <Button title="Next" />
      </Stacked.Trigger>
    </View>
  );
};

const ControlButton = ({ title }: { title: string }) => {
  return <Button title={title} />;
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 36,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
  },
  stack: {
    marginTop: 20,
  },
  controlContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
});
