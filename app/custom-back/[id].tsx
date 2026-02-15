import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import {
  SectionContainer,
  SectionDivider,
  SectionItem,
} from "@/components/custom-back/sections";

export default function Id() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const currentId = Number(id);
  const nextId1 = String(currentId + 1).padStart(3, "0");
  const nextId2 = String(currentId + 2).padStart(3, "0");
  const nextId3 = String(currentId + 3).padStart(3, "0");

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <SectionContainer>
        <SectionItem
          title={`Page ${nextId1}`}
          href={`/custom-back/${nextId1}`}
        />
        <SectionDivider />
        <SectionItem
          title={`Page ${nextId2}`}
          href={`/custom-back/${nextId2}`}
        />
        <SectionDivider />
        <SectionItem
          title={`Page ${nextId3}`}
          href={`/custom-back/${nextId3}`}
        />
      </SectionContainer>
    </ThemedView>
  );
}
