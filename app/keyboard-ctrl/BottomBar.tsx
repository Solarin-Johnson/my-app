import { View, Text, StyleSheet, Pressable, ViewStyle } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { ClockFading, LucideProps, Search, Star } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function BottomBar() {
  const { bottom } = useSafeAreaInsets();
  const searchExpanded = useSharedValue(false);

  return (
    <View style={[styles.container, { paddingBottom: bottom + 24 }]}>
      <BarIcons searchExpanded={searchExpanded} />
    </View>
  );
}

const BarIcons = ({
  searchExpanded,
}: {
  searchExpanded: SharedValue<boolean>;
}) => {
  const text = useThemeColor("text");
  const iconProps: LucideProps = {
    color: text,
    size: 24,
    strokeWidth: 1.8,
  };
  return (
    <View style={styles.barIcons}>
      <BarIcon onPress={() => {}}>
        <ClockFading {...iconProps} />
      </BarIcon>
      <BarIcon onPress={() => {}} style={{ aspectRatio: 5 / 2 }}>
        <Search {...iconProps} size={20} />
        <ThemedText>Search</ThemedText>
      </BarIcon>
      <BarIcon onPress={() => {}}>
        <Star {...iconProps} />
      </BarIcon>
    </View>
  );
};

const BarIcon = ({
  onPress,
  children,
  style,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}) => {
  const text = useThemeColor("text");

  return (
    <ThemedView style={styles.rounded}>
      <Pressable
        style={[
          styles.barIcon,
          styles.rounded,
          { backgroundColor: text + "15" },
          style,
        ]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    paddingTop: 24,
    width: "100%",
    alignItems: "center",
  },

  barIcons: {
    flexDirection: "row",
    gap: 12,
    height: 72,
    padding: 8,
  },
  rounded: {
    borderRadius: 36,
    overflow: "hidden",
  },
  barIcon: {
    flexDirection: "row",
    gap: 8,
    height: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
