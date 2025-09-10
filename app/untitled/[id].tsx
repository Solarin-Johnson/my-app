import React from "react";
import { router } from "expo-router";
import UntitledScreen from "@/components/untitled/screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import UntitledButton, {
  UntitledButtonWrapper,
} from "@/components/untitled/button";
import { UntitledCardLarge } from "@/components/untitled/card";

export default function Index() {
  return (
    <UntitledScreen
      headerProps={{ children: <Header /> }}
      barProps={{ type: "fill" }}
    >
      <UntitledCardLarge />
    </UntitledScreen>
  );
}

const Header = () => {
  const goBack = () => {
    router.back();
  };
  return (
    <>
      <UntitledButtonWrapper>
        <UntitledButton onPress={goBack}>
          <Ionicons name="chevron-back" size={22} />
        </UntitledButton>
      </UntitledButtonWrapper>
      <UntitledButtonWrapper>
        <UntitledButton>
          <Ionicons name="link" size={19} />
        </UntitledButton>
        <UntitledButton>
          <Ionicons name="search" size={19} />
        </UntitledButton>
        <UntitledButton>
          <Ionicons name="ellipsis-horizontal-sharp" size={19} />
        </UntitledButton>
      </UntitledButtonWrapper>
    </>
  );
};
