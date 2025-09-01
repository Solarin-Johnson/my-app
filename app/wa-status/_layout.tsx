import { ThemedTextWrapper } from "@/components/ThemedText";
import { Stack, useNavigation } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerNavigationProp } from "@react-navigation/drawer";

export default function Layout() {
  const { top } = useSafeAreaInsets();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerLeft: () => <HeaderLeft />,
        headerTransparent: true,
        headerBackground: () => (
          <BlurView style={StyleSheet.absoluteFill} intensity={20} />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Status",
          headerShown: true,
        }}
      />
    </Stack>
  );
}

const HeaderLeft = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Pressable onPress={() => navigation.openDrawer()}>
      <ThemedTextWrapper
        style={{
          textAlign: "center",
          width: 32,
        }}
      >
        <Feather name="chevron-left" size={25} />
      </ThemedTextWrapper>
    </Pressable>
  );
};
