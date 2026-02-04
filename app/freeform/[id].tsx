import { View } from "react-native";
import React, { useState } from "react";
import { Link, Stack } from "expo-router";
import { Image, useImage } from "expo-image";
import DrawPad from "expo-drawpad";

const BRUSH_TYPES = [
  { id: "solid", icon: "circle", label: "Solid" },
  { id: "dashed", icon: "circle.dashed", label: "Dashed" },
  { id: "dotted", icon: "circle.dotted", label: "Dotted" },
] as const;

const LINE_WEIGHTS = [
  { id: "thin", label: "Thin" },
  { id: "medium", label: "Medium" },
  { id: "thick", label: "Thick" },
] as const;

const VARIABLE_WEIGHTS = ["2", "4", "6", "7", "8"] as const;

export default function Page() {
  const [selectedBrush, setSelectedBrush] = React.useState<string>("solid");
  const [selectedWeight, setSelectedWeight] = useState<string>("3");
  const [canUndo, setCanUndo] = React.useState(false);

  const customIcon = useImage("https://simpleicons.org/icons/expo.svg", {
    maxWidth: 21,
    maxHeight: 21,
  });

  const LINE_WEIGHTS_MAP = {
    thin: "1",
    medium: "3",
    thick: "5",
  } as const;
  

  return (
    <>
      <Stack.Screen.BackButton displayMode="minimal" />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="arrow.uturn.backward" disabled={!canUndo} />
        <Stack.Toolbar.Button icon="square.and.arrow.up" />
        <Stack.Toolbar.Button icon="ellipsis" />
      </Stack.Toolbar>
      <Stack.Toolbar placement="bottom">
        <Stack.Toolbar.Button icon="paintpalette" />
        <Stack.Toolbar.Menu icon="paintbrush.pointed" title="Choose Brush">
          {BRUSH_TYPES.map((brush) => (
            <Stack.Toolbar.MenuAction
              key={brush.id}
              icon={brush.icon}
              isOn={selectedBrush === brush.id}
              onPress={() => setSelectedBrush(brush.id)}
            >
              {brush.label}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.Menu
          icon="lineweight"
          title="Select Line Weight"
          image={require("@/assets/images/dp.png")}
        >
          {LINE_WEIGHTS.map((weight) => (
            <Stack.Toolbar.MenuAction
              key={weight.id}
              isOn={selectedWeight === LINE_WEIGHTS_MAP[weight.id]}
              onPress={() => setSelectedWeight(LINE_WEIGHTS_MAP[weight.id])}
            >
              {weight.label}
            </Stack.Toolbar.MenuAction>
          ))}
          <Stack.Toolbar.Menu title="Variable Weight">
            {VARIABLE_WEIGHTS.map((weight) => (
              <Stack.Toolbar.MenuAction
                key={weight}
                isOn={selectedWeight === weight}
                onPress={() => setSelectedWeight(weight)}
              >
                {weight}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button icon="square.and.pencil" />
      </Stack.Toolbar>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        {/* <Text>Page</Text> */}
        {/* <Link.AppleZoomTarget>
          <View style={{ flex: 1 }}>
            <Image
              source={require("@/assets/images/dp.png")}
              style={{ width: "100%", height: 300 }}
            />
          </View>
        </Link.AppleZoomTarget> */}
        <View style={{ flex: 1 }}>
          <DrawPad />
        </View>
      </View>
    </>
  );
}
