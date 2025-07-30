import { View, Text, useWindowDimensions } from "react-native";
import React from "react";

export default function GrokSidebar() {
  const { width } = useWindowDimensions();
  return (
    <View style={{ backgroundColor: "#ffffff10", flex: 1 }}>
      <Text>Grok</Text>
    </View>
  );
}
