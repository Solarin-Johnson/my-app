import React from "react";
import { StyleSheet, View } from "react-native";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import TextArea from "@/components/TextArea";
import { ThemedTextWrapper } from "@/components/ThemedText";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function Index() {
  const text = useThemeColor("text");
  const bg = useThemeColor("background");
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: bg }]}>
          <View style={styles.container}>
            <Logo />
            <ThemedTextWrapper>
              <TextArea
                containerStyle={{
                  width: "80%",
                  height: 200,
                  margin: 24,
                }}
                style={{
                  textAlignVertical: "top",
                  borderColor: "#88888888",
                  borderRadius: 8,
                }}
                maxHeight={300}
                maxWidth={350}
                padding={12}
                minHeight={45}
                borderWidth={1}
                verticalAlign="bottom"
                timingConfig={{ duration: 0 }}
              />
            </ThemedTextWrapper>
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
    </KeyboardAvoidingView>
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
