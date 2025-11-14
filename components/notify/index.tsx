import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { View, StyleSheet } from "react-native";
import Banner from "./banner";
import { MessageType, NotifyContextType } from "./type";
import { useSharedValue } from "react-native-reanimated";
import { useKeyboardHandler } from "react-native-keyboard-controller";

const NotifyContext = createContext<NotifyContextType | null>(null);

let messageId = 0;
const MAX_MESSAGES = 2;

export const NotifyProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messageCount = useSharedValue(0);
  const progress = useSharedValue(0);
  const height = useSharedValue(0);

  const notify: NotifyContextType["notify"] = (msg, options) => {
    messageCount.value = messageCount.value + 1;
    setMessages((prev) => {
      const newMessage = { id: messageId++, text: msg, options };
      let newMessages = [...prev, newMessage];

      if (newMessages.length > MAX_MESSAGES) {
        newMessages = newMessages.slice(newMessages.length - MAX_MESSAGES);
      }

      return newMessages;
    });
  };

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        progress.value = e.progress;
        height.value = e.height;
      },
    },

    []
  );

  return (
    <NotifyContext value={{ notify, messages }}>
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {messages.map((message, index) => (
          <Banner
            key={message?.id}
            index={Number(message?.id)}
            message={message}
            messageCount={messageCount}
            keyboardHeight={height}
          />
        ))}
      </View>
    </NotifyContext>
  );
};

export const useNotify = () => {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error("useNotify must be used inside NotifyProvider");
  return ctx;
};
