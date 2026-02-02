import {
  View,
  StyleSheet,
  Switch,
  StyleProp,
  ViewStyle,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import React from "react";
import Slider from "@/components/Slider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
// import { ColorPicker, Host } from "@expo/ui/swift-ui";
import { useFancyText } from "./_layout";
import Button from "@/components/ui/Button";
import PressableBounce from "@/components/PresableBounce";
import { ThemedViewWrapper } from "@/components/ThemedView";

const isIos = Platform.OS === "ios";
export default function CustomizeScreen() {
  const { bounce, setBounce, currentIndex } = useFancyText();
  const textColor = useThemeColor("text");

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} bounces={false}>
        {setBounce && (
          <Cluster label="Bounce">
            <Switch
              style={{ alignSelf: "flex-end" }}
              value={bounce}
              onValueChange={setBounce}
            />
          </Cluster>
        )}
      </ScrollView>
      <ThemedViewWrapper colorName="text">
        <PressableBounce
          onPress={() => {
            currentIndex.value = (currentIndex.value + 1) % 3;
          }}
          style={styles.button}
          bounceScale={0.99}
        >
          <ThemedText colorName="background" type="semiBold">
            Next
          </ThemedText>
        </PressableBounce>
      </ThemedViewWrapper>
    </View>
  );
}

const Cluster = ({
  label,
  children,
  style,
}: {
  label?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={[styles.cluster, style]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View style={{ maxWidth: 200, flex: 1 }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  cluster: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    // backgroundColor: "red",
    height: 50,
    alignItems: "center",
  },
  label: {
    fontSize: 19,
  },
  input: {
    textAlign: "right",
    borderBottomWidth: 2,
    paddingVertical: 6,
    borderColor: "#888888AB",
  },
  button: {
    width: "100%",
    alignItems: "center",
    borderCurve: "continuous",
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 12,
  },
});
