import { View, Text } from "react-native";
import React from "react";

export default function HeaderTitle({}: {
  children: React.ReactNode;
  tintColor?: string;
  style?: any;
}) {
  return (
    <View>
      <Text>Header</Text>
    </View>
  );
}

export const HeaderRight = () => {
  return (
    <View>
      <Text>Right</Text>
    </View>
  );
};
