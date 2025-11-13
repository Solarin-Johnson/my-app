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
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

const NotifyContext = createContext<NotifyContextType | null>(null);

export const NotifyProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messageCount = useSharedValue(0);

  const notify: NotifyContextType["notify"] = (msg, options) => {
    setMessages((prev) => [...prev, { text: msg, options }]);
  };

  useDerivedValue(() => {
    messageCount.value = messages.length;
  });

  return (
    <NotifyContext value={{ notify, messages }}>
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {messages.map((message, index) => (
          <Banner
            key={index}
            index={index}
            message={message}
            messageCount={messageCount}
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
