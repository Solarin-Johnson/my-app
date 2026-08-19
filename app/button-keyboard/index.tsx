import React, { useCallback, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonKeyboard, {
  ButtonKeyboardInputRef,
} from "@/components/button-keyboard";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { useButtonKeyboard } from "@/components/button-keyboard/provider";
import { Pressable, Text } from "react-native";
import { useFocusEffect } from "expo-router";

export default function ButtonKeyboardPage() {
  const { openKeyboard, closeKeyboard } = useButtonKeyboard();
  const inputRef = useRef<ButtonKeyboardInputRef>(null!);

  useFocusEffect(
    useCallback(() => {
      openKeyboard();
      return () => {
        closeKeyboard();
      };
    }, []),
  );

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
          // backgroundColor: "#00000010",
          backgroundColor: "red",
        }}
      >
        <ButtonKeyboard.Input ref={inputRef} />
      </ThemedTextWrapper>
      <Pressable onPress={() => inputRef.current.delete()}>
        <ThemedText>delete</ThemedText>
      </Pressable>
      <Pressable onPress={() => inputRef.current.deleteAll()}>
        <ThemedText>delete all</ThemedText>
      </Pressable>
      <Pressable onPress={() => inputRef.current.blur()}>
        <ThemedText>blur</ThemedText>
      </Pressable>
      <Pressable onPress={() => inputRef.current.focus()}>
        <ThemedText>focus</ThemedText>
      </Pressable>
    </SafeAreaView>
  );
}
