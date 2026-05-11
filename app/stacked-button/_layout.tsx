import { isIos } from "@/constants";
import { Stack } from "expo-router";

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
        }}
      />
    </Stack>
  );
}
