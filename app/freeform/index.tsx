import { View, ScrollView, Pressable } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { Image } from "expo-image";

export default function Index() {
  return (
    <>
      <Stack.Screen.Title>Freeform</Stack.Screen.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon="ellipsis" palette></Stack.Toolbar.Menu>
      </Stack.Toolbar>
      <Stack.SearchBar onChangeText={() => {}} />
      <Stack.Toolbar placement="bottom">
        <Stack.Toolbar.SearchBarSlot />
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button icon="square.and.pencil" />
      </Stack.Toolbar>

      <ScrollView
        style={{ flex: 1, padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Link href={"/freeform/123"} asChild>
            <Pressable>
              <Link.AppleZoom>
                <Image
                  source={require("@/assets/images/dp.png")}
                  style={{ width: 200, height: 200 }}
                />
              </Link.AppleZoom>
            </Pressable>
          </Link>
        </View>
        <View style={{ height: 1200 }} />
      </ScrollView>
    </>
  );
}
