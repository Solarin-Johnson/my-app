import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { Stack, useNavigation } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ChevronLeft } from "lucide-react-native";

export default function Layout() {
  const bg = useThemeColor("waBg");
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerLeft: () => <HeaderLeft />,
        headerRight: () => <HeaderRight />,
        headerTransparent: true,
        headerBackground: () => (
          <BlurView style={StyleSheet.absoluteFill} intensity={60} />
        ),
        contentStyle: { backgroundColor: bg },
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

const HeaderRight = () => {
  return (
    <Pressable
      style={{
        width: 50,
        alignItems: "center",
        justifyContent: "center",
      }}
      hitSlop={8}
    >
      <ThemedText style={{ fontSize: 17 }}>Edit</ThemedText>
    </Pressable>
  );
};

const HeaderLeft = () => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Pressable
      onPress={() => navigation.openDrawer()}
      style={{
        width: 34,
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      hitSlop={8}
    >
      <ThemedTextWrapper>
        <ChevronLeft size={28} />
      </ThemedTextWrapper>
    </Pressable>
  );
};
