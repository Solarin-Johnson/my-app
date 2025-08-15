import GestureMenu, { GestureMenuItem } from "@/components/GestureMenu";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GestureMenuScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <GestureMenu
        style={{ backgroundColor: "white" }}
        horizontal
        itemWidth={80}
      >
        <GestureMenuItem
          label="Option 1"
          onPress={() => console.log("Option 1 pressed")}
        />
        <GestureMenuItem
          label="Option 2"
          onPress={() => console.log("Option 2 pressed")}
        />
        <GestureMenuItem
          label="Option 3"
          onPress={() => console.log("Option 3 pressed")}
        />
        <GestureMenuItem
          label="Option 4"
          onPress={() => console.log("Option 4 pressed")}
        />
      </GestureMenu>
    </SafeAreaView>
  );
}
