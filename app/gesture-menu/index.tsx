import GestureMenu, { GestureMenuItem } from "@/components/GestureMenu";
import { Feedback } from "@/functions";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GestureMenuScreen() {
  const onPress = (label: string) => {
    // Alert.alert(`Pressed ${label}`);
  };
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <GestureMenu
        style={{ backgroundColor: "white" }}
        // horizontal
        radius={32}
        spacing={8}
        itemHeight={45}
        itemWidth={70}
        trail={false}
        indicatorColor="#F1A039"
        width={240}
        hideSelectionOnBlur
        itemProps={{
          textStyle: { fontWeight: "500", textAlign: "left" },
          style: {
            paddingHorizontal: 10,
          },
        }}
      >
        <GestureMenuItem label="Option 1" onPress={() => onPress("Option 1")} />
        <GestureMenuItem label="Option 2" onPress={() => onPress("Option 2")} />
        <GestureMenuItem label="Option 3" onPress={() => onPress("Option 3")} />
        <GestureMenuItem label="Option 4" onPress={() => onPress("Option 4")} />
        <GestureMenuItem label="Option 5" onPress={() => onPress("Option 5")} />
      </GestureMenu>
    </SafeAreaView>
  );
}
