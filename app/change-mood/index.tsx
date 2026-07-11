import { View, Text } from "react-native";
import React from "react";
import MoodChange from "@/components/change-mood";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <MoodChange>
        <MoodChange.Container>
          <MoodChange.Item tintColor="#3E26B1" />
          <MoodChange.Item tintColor="#193FC0" />
          <MoodChange.Item tintColor="#5798AF" />
          <MoodChange.Item tintColor="#C6A235" />
          <MoodChange.Item tintColor="#ED7F46" />
        </MoodChange.Container>
      </MoodChange>
    </SafeAreaView>
  );
}
