import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";

export default function Layout() {
  const bg = useThemeColor("untitledBg");
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ contentStyle: { backgroundColor: bg } }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          contentStyle: { backgroundColor: bg },
          gestureEnabled: true,
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
