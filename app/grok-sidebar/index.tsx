import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { AudioLines, Paperclip, Zap } from "lucide-react-native";

const CHAT_BOX_HEIGHT = 100;
const CHAT_BOX_MARGIN_V = 6;

export default function GrokSidebar() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={CHAT_BOX_HEIGHT + CHAT_BOX_MARGIN_V * 2}
      >
        <ScrollView style={styles.screen}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Grok</Text>
        </ScrollView>
        <ChatBox />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ChatBox = () => {
  const text = useThemeColor("text");
  return (
    <View
      style={[
        styles.chatBox,
        {
          backgroundColor: text + "10",
          borderWidth: 2,
          borderColor: text + "10",
        },
      ]}
    >
      <ThemedTextWrapper style={styles.chatInput}>
        <TextInput placeholder="Ask Anything" selectionColor={text} />
      </ThemedTextWrapper>
      <View style={styles.chatActionBar}>
        <View style={styles.cluster}>
          <Button onPress={() => console.log("Send pressed")}>
            <Paperclip size={16} color={text} />
          </Button>
          <Button onPress={() => console.log("Send pressed")}>
            <Zap size={16} color={text} />
          </Button>
        </View>
        <Button
          style={{
            backgroundColor: text,
            paddingHorizontal: 14,
          }}
        >
          <ThemedTextWrapper colorName="background">
            <AudioLines size={16} strokeWidth={2.4} />
          </ThemedTextWrapper>
          <ThemedText
            colorName="background"
            type="defaultSemiBold"
            style={{ fontSize: 15 }}
          >
            Speak
          </ThemedText>
        </Button>
      </View>
    </View>
  );
};

const Button = ({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  const text = useThemeColor("text");

  return (
    <TouchableOpacity
      style={[
        styles.chatBtn,
        {
          borderColor: text + "10",
        },
        style,
      ]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    padding: 16,
  },
  chatBox: {
    minHeight: CHAT_BOX_HEIGHT,
    borderRadius: 30,
    borderCurve: "continuous",
    marginHorizontal: 12,
    marginVertical: CHAT_BOX_MARGIN_V,
    overflow: "hidden",
  },
  chatInput: {
    flex: 1,
    width: "100%",
    padding: 14,
    paddingBottom: 8,
  },
  chatActionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    paddingTop: 5,
  },
  chatBtn: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
    gap: 5,
  },
  cluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
