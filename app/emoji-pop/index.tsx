import { Pressable, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MessageBox from "@/components/emoji-pop/message-box";
import Bubble from "@/components/emoji-pop/bubble";
import { useSharedValue } from "react-native-reanimated";

export default function Page() {
  const pressing = useSharedValue(false);
  const [messages, setMessages] = React.useState<string[]>([]);

  const sendEmoji = (emoji: string) => {
    setMessages((prev) => [...prev, emoji]);
  };

  const handleLongPress = () => {
    pressing.set(true);
    sendEmoji("🫪");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "flex-end",
          paddingBottom: 20,
        }}
      >
        {messages.map((msg, index) => (
          <Bubble
            key={`${msg}-${Date.now()}-${index}`}
            emoji={msg}
            popping={index === messages.length - 1 ? pressing : undefined}
            index={index}
          />
        ))}
      </View>
      <MessageBox
        emojiPressableProps={{
          onLongPress: handleLongPress,
          onPressOut: () => pressing.set(false),
          onPress: () => sendEmoji("🫪"),
        }}
      />
    </SafeAreaView>
  );
}
