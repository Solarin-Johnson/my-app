import CustomBack from "@/components/custom-back";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      <CustomBack
        titles={{
          "/custom-back": "Home",
          // "[id]": "Detail",
          "124": "Custom Label",
        }}
        usePathTitles
      >
        <Stack
          screenOptions={{
            headerBackVisible: false,
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="[id]" />
        </Stack>
      </CustomBack>
    </View>
  );
}
