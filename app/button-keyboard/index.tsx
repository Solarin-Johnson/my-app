import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonKeyboard, {
  ButtonKeyboardInputRef,
} from "@/components/button-keyboard";
import { ThemedTextWrapper } from "@/components/ThemedText";
import { useButtonKeyboard } from "@/components/button-keyboard/provider";
import { Button } from "react-native";

export default function ButtonKeyboardPage() {
  const { openKeyboard } = useButtonKeyboard();
  const inputRef = useRef<ButtonKeyboardInputRef>(null!);

  useEffect(() => {
    openKeyboard();
  }, [openKeyboard]);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedTextWrapper
        type="italic"
        ignoreStyle={false}
        style={{
          fontSize: 36,
          textAlign: "center",
          backgroundColor: "#00000010",
        }}
      >
        <ButtonKeyboard.Input ref={inputRef} />
      </ThemedTextWrapper>
      <Button title="delete" onPress={() => inputRef.current.delete()} />
      <Button title="delete all" onPress={() => inputRef.current.deleteAll()} />
    </SafeAreaView>
  );
}
