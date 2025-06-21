import React, { memo } from "react";
import {
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Pressable, ScrollView, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";

const DrawerContent = memo((props: DrawerContentComponentProps) => {
  const { descriptors, navigation, state } = props;
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
      <Pressable onPress={() => navigation.closeDrawer()}>
        <ThemedText style={{ fontSize: 16, padding: 20 }}>
          Close Drawer
        </ThemedText>
      </Pressable>
    </SafeAreaView>
  );
});

export default DrawerContent;
