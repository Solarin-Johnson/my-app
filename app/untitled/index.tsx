import React from "react";
import { Link } from "expo-router";
import { ThemedTextWrapper } from "@/components/ThemedText";
import UntitledScreen from "@/components/untitled/screen";
import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import UntitledButton, {
  UntitledButtonWrapper,
} from "@/components/untitled/button";

export default function Index() {
  return (
    <UntitledScreen headerProps={{ title: "[untitled]", children: <Header /> }}>
      <ThemedTextWrapper>
        <Link href="/untitled/1">Go to ID 123</Link>
      </ThemedTextWrapper>
    </UntitledScreen>
  );
}

const Header = () => {
  return (
    <UntitledButtonWrapper>
      <UntitledButton>
        <Ionicons name="notifications" size={19} />
      </UntitledButton>
      <UntitledButton>
        <Ionicons name="search" size={19} />
      </UntitledButton>
      <UntitledButton>
        <Ionicons name="person" size={19} />
      </UntitledButton>
    </UntitledButtonWrapper>
  );
};
