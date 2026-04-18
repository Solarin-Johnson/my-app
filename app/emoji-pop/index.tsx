import { Pressable, Text, View } from "react-native";
import React, { useRef } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import MessageBox from "@/components/emoji-pop/message-box";
import Bubble from "@/components/emoji-pop/bubble";
import Animated, {
  LinearTransition,
  useSharedValue,
} from "react-native-reanimated";
import { applySpringConfig } from "@/functions";
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from "react-native-keyboard-controller";

export default function Page() {
  const pressing = useSharedValue(false);
  const stalePressing = useSharedValue(false);
  const activeId = useRef<number | null>(null);
  const { bottom } = useSafeAreaInsets();

  const [messages, setMessages] = React.useState<
    { id: number; emoji: string; isLong: boolean }[]
  >([]);

  const sendEmoji = (emoji: string, isLong = false) => {
    const id = Date.now();

    setMessages((prev) => [...prev, { id, emoji, isLong }]);

    if (isLong) {
      activeId.current = id;
    }
  };

  const handleLongPress = () => {
    pressing.set(true);
    sendEmoji("🫪", true);
  };

  return (
    <>
      <Animated.FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: msg, index }) => (
          <Bubble
            key={msg.id}
            emoji={msg.emoji}
            popping={msg.id === activeId.current ? pressing : stalePressing}
            index={index + 1}
            totalLength={messages.length}
          />
        )}
        style={{ flex: 1 }}
        contentContainerStyle={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          paddingBottom: 70 + bottom,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        layout={applySpringConfig(LinearTransition)}
        renderScrollComponent={(props) => (
          <KeyboardAwareScrollView
            {...props}
            extraKeyboardSpace={-bottom * 0.8}
          />
        )}
      />
      <MessageBox
        emojiPressableProps={{
          onLongPress: handleLongPress,
          onPressOut: () => pressing.set(false),
          onPress: () => sendEmoji("🫪"),
          delayLongPress: 200,
        }}
      />
    </>
  );
}
