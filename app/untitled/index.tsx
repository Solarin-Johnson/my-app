import React from "react";
import UntitledScreen from "@/components/untitled/screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import UntitledButton, {
  UntitledButtonWrapper,
} from "@/components/untitled/button";
import {
  UntitledCardMini,
  UntitledCardMiniWrapper,
} from "@/components/untitled/card";
import Transition from "react-native-screen-transitions";

const ScrollView = Transition.ScrollView;

export default function Index() {
  return (
    <UntitledScreen headerProps={{ title: "[untitled]", children: <Header /> }}>
      <ScrollView style={{ flex: 1 }}>
        <UntitledCardMiniWrapper>
          <UntitledCardMini />
          <UntitledCardMini />
          <UntitledCardMini />
        </UntitledCardMiniWrapper>
      </ScrollView>
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
