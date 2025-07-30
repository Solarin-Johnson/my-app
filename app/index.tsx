import React from "react";
import { StyleSheet, View } from "react-native";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";

export default function Index() {
  const text = useThemeColor("text");
  const bg = useThemeColor("background");
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={styles.container}>
          <Logo />
        </View>
        <Button
          title="Start Exploring"
          bgcolor={text}
          color={bg}
          style={{
            width: "80%",
            padding: 16,
            marginBottom: 24,
          }}
          onPress={() => navigation.openDrawer()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
