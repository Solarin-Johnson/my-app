import { ThemedTextWrapper } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GlassView } from "expo-glass-effect";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <ThemedView style={styles.container} colorName="slackBg">
      <SafeAreaView>
        <GlassView glassEffectStyle="clear" isInteractive style={styles.glass}>
          <ThemedTextWrapper style={styles.text} type="defaultSemiBold">
            <Link href="/slack-liquid-glass/chat" suppressHighlighting>
              Open Chat
            </Link>
          </ThemedTextWrapper>
        </GlassView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    padding: 16,
    textAlign: "center",
    width: 280,
    fontSize: 16,
  },
  glass: {
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
