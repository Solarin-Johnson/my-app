import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import React from "react";
import { GlassContainer, GlassView } from "expo-glass-effect";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import { Plus } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import TextArea from "../TextArea";

type MessageBoxProps = {
  emojiPressableProps?: React.ComponentProps<typeof Pressable>;
};

export default function MessageBox({ emojiPressableProps }: MessageBoxProps) {
  const { bottom } = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={-bottom / 2}
    >
      <GlassContainer
        style={[
          styles.container,
          {
            paddingBottom: bottom,
          },
        ]}
        spacing={6}
      >
        <GlassView style={styles.buttonWrapper} isInteractive>
          <Pressable style={styles.button}>
            <ThemedTextWrapper>
              <Plus />
            </ThemedTextWrapper>
          </Pressable>
        </GlassView>
        <GlassView
          style={[styles.buttonWrapper, styles.inputWrapper]}
          isInteractive
        >
          <ThemedTextWrapper>
            <TextArea
              placeholder="Type a message..."
              style={styles.input}
              padding={14}
              maxHeight={200}
            />
          </ThemedTextWrapper>
        </GlassView>
        <GlassView style={styles.buttonWrapper} isInteractive>
          <Pressable style={styles.button} {...emojiPressableProps}>
            <ThemedText style={styles.emojiText}>🫪</ThemedText>
          </Pressable>
        </GlassView>
      </GlassContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 8,
  },
  buttonWrapper: {
    borderRadius: 25,
    borderCurve: "continuous",
  },
  button: {
    height: 44,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    flex: 1,
    height: "100%",
  },
  input: {
    paddingHorizontal: 16,
    fontSize: 16,
  },
  emojiText: {
    fontSize: 28,
  },
});
