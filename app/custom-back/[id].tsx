import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams } from "expo-router";

export default function Id() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const nextId = id ? String(Number(id) + 1) : "1";

  return (
    <SafeAreaView>
      <Text>Current ID: {id}</Text>
      <Link href={`/custom-back/${nextId}`}>Go to next ID ({nextId})</Link>
    </SafeAreaView>
  );
}
