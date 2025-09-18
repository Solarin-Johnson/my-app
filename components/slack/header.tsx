import { Sparkles } from "lucide-react-native";
import { View, Text, StyleSheet } from "react-native";
import { NativeStackHeaderRightProps } from "react-native-screen-transitions";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import { Button, ContextMenu, Host, Text as UIText } from "@expo/ui/swift-ui";
import { scaleEffect, opacity } from "@expo/ui/swift-ui/modifiers";

export default function HeaderTitle({
  children,
  tintColor,
  style,
}: {
  children: React.ReactNode;
  tintColor?: string;
  style?: any;
}) {
  return (
    <View
      style={{
        flex: 1,
        marginRight: 48,
        alignItems: "center",
      }}
    >
      <Text style={[{ color: tintColor }, style]}>{children}</Text>
    </View>
  );
}

export const HeaderRight = ({}: NativeStackHeaderRightProps) => {
  return (
    <Host matchContents>
      <ContextMenu>
        <ContextMenu.Items>
          <Button disabled>Unreads</Button>
          <Button variant="bordered">Last 7 days</Button>
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <View style={styles.rightContainer}>
            <ThemedTextWrapper>
              <Sparkles size={20} strokeWidth={1.8} />
            </ThemedTextWrapper>
          </View>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
};

const styles = StyleSheet.create({
  rightContainer: {
    width: 36,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
