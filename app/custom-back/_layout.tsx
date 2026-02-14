import CustomBack from "@/components/custom-back";
import { useNavigation } from "@react-navigation/native";
import { router, Stack, usePathname, useSegments } from "expo-router";
import { useEffect, useRef } from "react";

import { Pressable, View } from "react-native";

export default function Layout() {
  return (
    <CustomBack>
      <Stack screenOptions={{ headerBackVisible: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[id]" />
      </Stack>
    </CustomBack>
  );
}
