import { View } from "react-native";
import React from "react";
import { LogoIcon } from "../icons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Logo() {
  const text = useThemeColor("text");
  return (
    <View>
      <LogoIcon fill={text} size={72} />
    </View>
  );
}
