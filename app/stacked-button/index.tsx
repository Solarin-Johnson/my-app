import { ThemedTextWrapper } from "@/components/ThemedText";
import { ThemedView, ThemedViewWrapper } from "@/components/ThemedView";
import { GlassView } from "expo-glass-effect";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <ThemedViewWrapper colorName="untitledBg">
      <SafeAreaView style={styles.container}>
        <GlassView glassEffectStyle="clear" isInteractive style={styles.glass}>
          <ThemedTextWrapper style={styles.text} type="semiBold">
            <Link href="/stacked-button/sheet" suppressHighlighting>
              Sign
            </Link>
          </ThemedTextWrapper>
        </GlassView>
      </SafeAreaView>
    </ThemedViewWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 16,
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
