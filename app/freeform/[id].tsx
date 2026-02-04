import { View } from "react-native";
import React, { useRef, useState } from "react";
import { Link, router, Stack } from "expo-router";
import { Image, useImage } from "expo-image";
import DrawPad, { BrushType, DrawPadHandle } from "expo-drawpad";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import * as Clipboard from "expo-clipboard";

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

const LINE_WEIGHTS_MAP = {
  thin: "2",
  medium: "4",
  thick: "6",
} as const;

const VARIABLE_WEIGHTS = ["1", "5", "7", "8"];

export default function Page() {
  const [selectedBrush, setSelectedBrush] = useState<BrushType>("solid");
  const [selectedWeight, setSelectedWeight] = useState<string>("4");
  const [canUndo, setCanUndo] = useState(false);
  const padRef = useRef<DrawPadHandle>(null);
  const pathLength = useSharedValue(0);
  const playing = useSharedValue(false);

  const customIcon = useImage("https://simpleicons.org/icons/expo.svg", {
    maxWidth: 21,
    maxHeight: 21,
  });

  useAnimatedReaction(
    () => pathLength.value,
    (current) => {
      scheduleOnRN(setCanUndo, current > 0);
    },
  );

  const handleUndo = () => {
    padRef.current?.undo();
  };

  const handleUndoAll = () => {
    padRef.current?.erase();
  };

  const handlePlay = () => {
    padRef.current?.play();
  };

  const copySVGToClipboard = async () => {
    const svg = await padRef.current?.getSVG?.();

    if (svg) {
      await Clipboard.setStringAsync(svg);
      alert("SVG copied to clipboard!");
    }
  };

  return (
    <>
      <Stack.Screen.BackButton displayMode="minimal" />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="arrow.uturn.backward"
          disabled={!canUndo}
          onPress={handleUndo}
        />
        <Stack.Toolbar.Button icon="square.and.arrow.up" />
        <Stack.Toolbar.Menu icon="ellipsis">
          <Stack.Toolbar.MenuAction
            icon="arrow.uturn.backward"
            onPress={handleUndoAll}
          >
            Undo All
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction
            icon="pencil.and.scribble"
            onPress={handlePlay}
            disabled={!canUndo}
          >
            Play Drawing
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction
            icon="doc.on.doc"
            onPress={copySVGToClipboard}
          >
            Copy SVG
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
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
        <Stack.Toolbar.Button
          icon="square.and.pencil"
          onPress={() => router.replace("/freeform/001")}
        />
      </Stack.Toolbar>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <View style={{ flex: 1 }}>
          <DrawPad
            ref={padRef}
            brushType={selectedBrush}
            strokeWidth={parseInt(selectedWeight)}
            pathLength={pathLength}
            playing={playing}
            stroke="#000000"
          />
        </View>
      </View>
    </>
  );
}
