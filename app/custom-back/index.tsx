import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView>
      <Text>Index</Text>
      <Link href="/custom-back/123">Go to [id]</Link>
    </SafeAreaView>
  );
}
