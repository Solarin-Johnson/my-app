import React, { memo } from "react";
import {
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image } from "expo-image";

const DrawerContent = memo((props: DrawerContentComponentProps) => {
  const { navigation } = props;
  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
      <View>
        <ThemedText style={{ fontSize: 20, fontWeight: "bold", padding: 20 }}>
          Drawer Content
        </ThemedText>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 12, gap: 6 }}>
        <DrawerItemList {...props} />
      </ScrollView>
      <DrawerFooter />
    </SafeAreaView>
  );
});

const DrawerFooter = () => {
  const text = useThemeColor("text");
  return (
    <View style={styles.footer}>
      <Image source={require("@/assets/images/dp.png")} style={styles.image} />
      <ThemedText>Solarin</ThemedText>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  image: {
    width: 28,
    aspectRatio: 1,
    borderRadius: 12,
  },
});
