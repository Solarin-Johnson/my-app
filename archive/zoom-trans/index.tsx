import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Transition from "react-native-screen-transitions";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Transition.Boundary.Trigger
        id={"photo-1"}
        anchor="leading"
        scaleMode="uniform"
        style={styles.row}
        onPress={() => router.navigate("/zoom-trans/detail")}
      >
        <Image
          source={require("@/assets/images/dp.png")}
          style={styles.artwork}
        />
      </Transition.Boundary.Trigger>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  artwork: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});
