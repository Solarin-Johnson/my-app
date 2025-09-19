import SlackBanner from "@/components/slack/banner";
import { CLOSED_HEIGHT } from "@/components/slack/config";
import MessageBar from "@/components/slack/message-bar";
import MessageBox from "@/components/slack/message-box";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, ScrollView, View } from "react-native";

const MSG_BOX_HEIGHT = 60;

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: MSG_BOX_HEIGHT }}
        contentInsetAdjustmentBehavior="automatic"
        scrollIndicatorInsets={{ bottom: MSG_BOX_HEIGHT }}
        keyboardDismissMode="interactive"
      >
        <SlackBanner />
        <MessageBox />
      </ScrollView>
      <MessageBar />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
