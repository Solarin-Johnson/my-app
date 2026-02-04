import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Image } from "expo-image";

export default function Page() {
  return (
    <View style={{ flex: 1 }}>
      <Text>Page</Text>
      <Link.AppleZoomTarget>
        <Image source={require("@/assets/images/dp.png")} style={{ flex: 1 }} />
      </Link.AppleZoomTarget>
    </View>
  );
}
