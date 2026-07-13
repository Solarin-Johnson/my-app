import GestureMenu, { GestureMenuItem } from "@/components/GestureMenu";
import { Feedback } from "@/functions";
import { Lock, Search } from "lucide-react-native";
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
      {(() => {
        const items = [
          { label: "Option 1", icon: <Search size={19} strokeWidth={2.4} /> },
          { label: "Option 2" },
          { label: "Option 3" },
          // { label: "Option 4" },
          // { label: "Option 5" },
        ];

        return (
          <GestureMenu
            style={{ backgroundColor: "white", borderRadius: 12 }}
            // horizontal
            radius={32}
            itemHeight={46}
            itemWidth={120}
            trail={false}
            // indicatorColor="#F1A039"
            width={240}
            // hideSelectionOnBlur
            itemProps={{
              textStyle: { fontWeight: "500" },
              style: {
                paddingHorizontal: 12,
                gap: 8,
              },
              color: "#333",
              icon: <Lock size={19} strokeWidth={2.4} />,
            }}
            roundedIndicator={false}
          >
            {items.map(({ label, icon }) => (
              <GestureMenuItem
                key={label}
                label={label}
                onPress={() => onPress(label)}
                icon={icon}
              />
            ))}
          </GestureMenu>
        );
      })()}
    </SafeAreaView>
  );
}
