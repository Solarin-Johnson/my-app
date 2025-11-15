import { StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { MessageType } from "@/components/notify/type";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { useNotify } from "@/components/notify";
import PressableBounce from "@/components/PresableBounce";

const isLiquidGlass = isLiquidGlassAvailable();

const ExpandedContent = () => {
  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      <ThemedText type="defaultSemiBold" style={styles.title}>
        Expanded content goes here
      </ThemedText>
      <ThemedText style={styles.description}>
        You can put any React Node
      </ThemedText>
      <ThemedTextWrapper>
        <TextInput placeholder="Type your message" style={styles.input} />
      </ThemedTextWrapper>
    </ScrollView>
  );
};

const notifPayload: MessageType = {
  text: "Welcome",
  options: {
    description: "This is a normal notification",
    action: {
      label: "OK",
      onClick: () => {
        console.log("Notification action clicked");
      },
    },
  },
};

const expandableNotifPayload: MessageType = {
  text: "Expandable",
  options: {
    description: "This is an expandable notification",
    expandedChild: <ExpandedContent />,
    action: {
      label: "OK",
      onClick: () => {
        console.log("Expandable notification action clicked");
      },
    },
  },
};

export default function Index() {
  const { notify } = useNotify();

  return (
    <ThemedView style={styles.container}>
      <NotifyButton
        onPress={() => notify(notifPayload.text, notifPayload.options)}
        label="Send Normal"
      />
      <NotifyButton
        onPress={() =>
          notify(expandableNotifPayload.text, expandableNotifPayload.options)
        }
        label="Send Expandable"
      />
    </ThemedView>
  );
}

const NotifyButton = ({
  onPress,
  label,
}: {
  onPress: () => void;
  label: string;
}) => {
  const PressableComponent = isLiquidGlass ? Pressable : PressableBounce;
  const Wrapper = isLiquidGlass ? GlassView : ThemedView;
  const WrapperProps = isLiquidGlass
    ? { style: styles.glass, isInteractive: true }
    : { colorName: "barColor" as const, style: styles.glass };

  return (
    <PressableComponent onPress={onPress}>
      <Wrapper {...WrapperProps}>
        <ThemedText style={styles.buttonText}>{label}</ThemedText>
      </Wrapper>
    </PressableComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    fontFamily: "ui-rounded",
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    fontFamily: "ui-rounded",
  },
  glass: {
    borderRadius: 40,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    padding: 16,
    fontSize: 18,
    textAlign: "center",
    width: 280,
  },
  input: {
    marginTop: 16,
    width: "100%",
    height: 45,
    borderColor: "#88888850",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderCurve: "continuous",
  },
});
