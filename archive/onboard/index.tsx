import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Onboard from "@/components/onboard";

export default function OnboardScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Onboard>
        <Onboard.Screen>
          <Onboard.Screenshot source={"https://i.imgur.com/TaKKRAa.jpeg"} />
        </Onboard.Screen>
      </Onboard>
    </View>
  );
}
