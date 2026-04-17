import { Pressable, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MessageBox from "@/components/emoji-pop/message-box";
import Bubble from "@/components/emoji-pop/bubble";
import { useSharedValue } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";

export default function Page() {
  const pressing = useSharedValue(false);
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={{ flex: 1 }}>
        <View style={{ position: "absolute", top: 100, right: 100 }}>
          <Bubble emoji="✌️" popping={pressing} />
        </View>
        <Pressable
          onPressIn={() => pressing.set(true)}
          onPressOut={() => pressing.set(false)}
        >
          <ThemedText>Press me</ThemedText>
        </Pressable>
        <Text>Page</Text>
      </View>
      <MessageBox />
    </SafeAreaView>
  );
}
