import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { ThemedViewWrapper } from "@/components/ThemedView";
import { StackedButton } from "@/components/stacked-button";
import { GlassView } from "expo-glass-effect";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function StackedButtonExample() {
  return (
    <View style={styles.stackedButtonContainer}>
      <StackedButton.Provider itemStyles={{ borderRadius: 25 }} gap={8}>
        <StackedButton.Container>
          <StackedButton.Item
            expandedElement={<ThemedText>First Item</ThemedText>}
          >
            <ThemedText>First</ThemedText>
          </StackedButton.Item>
          <StackedButton.Item disableExpand>
            <ThemedText>Second</ThemedText>
          </StackedButton.Item>
          <StackedButton.Item
            expandedElement={<ThemedText>Third Item</ThemedText>}
          >
            <ThemedText>Third</ThemedText>
          </StackedButton.Item>
        </StackedButton.Container>
      </StackedButton.Provider>
    </View>
  );
}

export default function Index() {
  return (
    <ThemedViewWrapper colorName="untitledBg">
      <SafeAreaView style={styles.container}>
        <StackedButtonExample />
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
    justifyContent: "space-around",
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
  stackedButtonContainer: {
    width: "100%",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
