import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { GlassView } from "expo-glass-effect";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedTextWrapper } from "../ThemedText";
import { Mic, Plus } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { ThemedView } from "../ThemedView";

export default function MessageBar() {
  const { bottom } = useSafeAreaInsets();
  const text = useThemeColor("slackText");

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={-bottom + 10}
      style={styles.wrapper}
    >
      <GlassView
        style={[styles.container, { bottom }]}
        glassEffectStyle="regular"
        isInteractive
      >
        <ThemedView
          colorName="slackBg"
          style={[styles.button, styles.buttonWrapper]}
        >
          <Pressable style={[styles.button, { backgroundColor: text + "10" }]}>
            <ThemedTextWrapper colorName="slackText">
              <Plus size={23} />
            </ThemedTextWrapper>
          </Pressable>
        </ThemedView>
        <ThemedTextWrapper>
          <TextInput
            style={[styles.input, { color: text }]}
            placeholder="Message"
            placeholderTextColor={text + "80"}
          />
        </ThemedTextWrapper>
        <Pressable style={styles.button}>
          <ThemedTextWrapper colorName="slackText">
            <Mic size={20} strokeWidth={1.9} />
          </ThemedTextWrapper>
        </Pressable>
      </GlassView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  container: {
    marginHorizontal: 16,
    borderRadius: 30,
    borderCurve: "continuous",
    height: 58,
    padding: 10,
    justifyContent: "center",
    flexDirection: "row",
  },
  button: {
    height: "100%",
    aspectRatio: 1,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
  },
  buttonWrapper: {
    opacity: 1,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
});
