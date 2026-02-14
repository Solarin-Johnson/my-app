import CustomBack from "@/components/custom-back";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      <CustomBack>
        <Stack
          screenOptions={{
            headerBackVisible: false,
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="[id]" />
        </Stack>
      </CustomBack>
    </View>
  );
}
