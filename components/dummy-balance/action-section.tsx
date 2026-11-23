import { StyleSheet, Text, View } from "react-native";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import { ReactElement } from "react";
import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react-native";
import { ThemedView, ThemedViewWrapper } from "../ThemedView";
import PressableBounce from "../PresableBounce";

export default function ActionSection() {
  return (
    <View style={styles.section}>
      <Item label="Send" icon={<ArrowUpRight strokeWidth={2.2} />} />
      <Item label="Top Up" icon={<Plus strokeWidth={2.2} />} />
    </View>
  );
}

const Item = ({ label, icon }: { label: string; icon: ReactElement<any> }) => {
  return (
    <ThemedViewWrapper style={styles.item} colorName="invertedTheme">
      <PressableBounce>
        <ThemedTextWrapper colorName="background">{icon}</ThemedTextWrapper>
        <ThemedText
          style={styles.label}
          colorName="background"
          numberOfLines={1}
        >
          {label}
        </ThemedText>
      </PressableBounce>
    </ThemedViewWrapper>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
    height: 54,
  },
  item: {
    flexGrow: 1,
    justifyContent: "center",
    borderRadius: 24,
    borderCurve: "continuous",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundImage: "linear-gradient(50deg, transparent 10%, #88888850 100%)",
  },
  label: {
    marginHorizontal: 10,
    fontSize: 17,
    fontFamily: "ui-monospace",
    fontWeight: "600",
    letterSpacing: -0.3,
  },
});
