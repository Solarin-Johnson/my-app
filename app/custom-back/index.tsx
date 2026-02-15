import { View } from "react-native";
import React from "react";
import {
  SectionContainer,
  SectionDivider,
  SectionItem,
} from "@/components/custom-back/sections";
import { ThemedView } from "@/components/ThemedView";

export default function Index() {
  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <SectionContainer>
        <SectionItem title="Page 100" href="/custom-back/100" />
        <SectionDivider />
        <SectionItem title="Page 110" href="/custom-back/110" />
        <SectionDivider />
        <SectionItem title="Page 120" href="/custom-back/120" />
      </SectionContainer>
    </ThemedView>
  );
}
