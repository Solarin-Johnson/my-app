import CustomBack from "@/components/custom-back";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <CustomBack
      titles={{
        "/custom-back": "Home",
        "[id]": "[page]",
        "124": "Custom Label",
      }}
      // usePathTitles
    >
      <Stack
        screenOptions={{
          headerBackVisible: false,
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="[id]" options={{ title: "Page" }} />
      </Stack>
    </CustomBack>
  );
}
