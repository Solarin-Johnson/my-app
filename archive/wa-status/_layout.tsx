import { ThemedText } from "@/components/ThemedText";
import { Stack, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Pressable, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Layout() {
  const bg = useThemeColor("waBg");

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackButtonDisplayMode: "minimal",
        headerRight: () => <HeaderRight />,
        headerBackground: () => (
          <BlurView style={StyleSheet.absoluteFill} intensity={60} />
        ),
        headerTransparent: true,
        contentStyle: { backgroundColor: bg },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Status",
        }}
      />
      <Stack.Screen
        name="notes"
        options={{
          title: "Notes",
        }}
      />
      <Stack.Screen
        name="page"
        options={{
          title: "New Page",
          headerShown: true,
          headerRight: () => <HeaderRight text="Share" width={70} />,
          headerBackground: () => (
            <BlurView style={StyleSheet.absoluteFill} intensity={60} />
          ),
          headerTransparent: true,
          contentStyle: { backgroundColor: bg },
        }}
      />
    </Stack>
  );
}
const HeaderRight = ({
  text = "Edit",
  width = 50,
}: {
  text?: string;
  width?: number;
}) => {
  const router = useRouter();

  return (
    <Pressable
      // onPress={handlePress}
      style={{
        width,
        alignItems: "center",
        justifyContent: "center",
      }}
      hitSlop={8}
    >
      <ThemedText style={{ fontSize: 17 }}>{text}</ThemedText>
    </Pressable>
  );
};
