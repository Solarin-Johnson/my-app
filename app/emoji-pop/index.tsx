import React, { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MessageBox from "@/components/emoji-pop/message-box";
import Bubble from "@/components/emoji-pop/bubble";
import Animated, {
  LinearTransition,
  useSharedValue,
} from "react-native-reanimated";
import { applySpringConfig } from "@/functions";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function Page() {
  const pressing = useSharedValue(false);
  const stalePressing = useSharedValue(false);
  const activeId = useRef<number | null>(null);
  const { bottom, top } = useSafeAreaInsets();

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
        renderItem={({ item: msg, index }) => {
          const isCurrent = index === messages.length - 1;
          return (
            <Bubble
              key={msg.id}
              emoji={msg.emoji}
              popping={
                msg.id === activeId.current && isCurrent
                  ? pressing
                  : stalePressing
              }
              index={index + 1}
              isCurrent={isCurrent}
              onBurst={() => {
                setMessages((prev) => prev.filter((_, i) => i !== index));
              }}
            />
          );
        }}
        style={{ flex: 1 }}
        contentContainerStyle={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          paddingBottom: 70 + bottom,
          paddingTop: top,
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
