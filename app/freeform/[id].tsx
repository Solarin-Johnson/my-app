import { View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Image } from "expo-image";

export default function Page() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* <Text>Page</Text> */}
      <Link.AppleZoomTarget>
        <Image
          source={require("@/assets/images/dp.png")}
          style={{ width: "100%", height: 300 }}
        />
      </Link.AppleZoomTarget>
    </View>
  );
}
