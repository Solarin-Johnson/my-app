import { ThemedTextWrapper } from "@/components/ThemedText";
import { isIos } from "@/constants";
import { Link, router, Stack } from "expo-router";
import { X } from "lucide-react-native";
import { Pressable } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sheet"
        options={{
          title: "Add Signature",
          headerTitleStyle: {
            fontFamily: "InterMedium",
            fontSize: 21,
          },
          presentation: "formSheet",
          sheetAllowedDetents: [0.5],
          contentStyle: {
            ...(isIos && {
              backgroundColor: "transparent",
            }),
          },
          headerRight: () => (
            <Pressable
              onPress={router.back}
              style={{
                width: 36,
                height: 36,
                borderRadius: 25,
                alignItems: "center",
                justifyContent: "center",
              }}
              collapsable={false}
            >
              <ThemedTextWrapper>
                <X size={24} color="currentColor" />
              </ThemedTextWrapper>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
