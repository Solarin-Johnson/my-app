import { View, Text, StyleSheet, useColorScheme } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import DrawPad, { DrawPadHandle } from "expo-drawpad";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StackedButton } from "@/components/stacked-button";
import { ButtonCluster, ButtonIcon, ButtonItem } from "@/components/untitled";
import { ThemedViewWrapper } from "@/components/ThemedView";
import {
  BrushCleaning,
  RefreshCcw,
  RotateCw,
  Stamp,
  Trash2,
  X,
} from "lucide-react-native";
import { useSharedValue } from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";

export default function Sheet() {
  const { top } = useSafeAreaInsets();
  console.log("top", top);
  const currentIndex = useSharedValue(0);
  const padRef = useRef<DrawPadHandle>(null);

  const appleRed = useThemeColor("appleRed");
  const bg = useThemeColor("untitledBg");
  const text = useThemeColor("text");
  const isDark = useColorScheme() === "dark";
  const [strokeColor, setStrokeColor] = useState("grey");

  const redStyle = {
    backgroundColor: appleRed,
  };

  const bgStyle = {
    backgroundColor: bg,
  };

  const textStyle = {
    backgroundColor: text,
  };

  const handleCancel = () => {
    if (padRef.current) {
      currentIndex.value = padRef.current.getPaths().length > 0 ? 0 : 1;
      router.back();
    }
  };

  const handleReset = () => {
    if (padRef.current) {
      padRef.current.erase();
    }
  };

  const handleConfirm = () => {
    router.back();
    currentIndex.value = 2;
  };

  const handleConfirmExpand = () => {};

  return (
    <View style={{ flex: 1, paddingTop: top, padding: 26, gap: 12 }}>
      <View style={{ flex: 1 }}>
        <DrawPad
          ref={padRef}
          onDrawStart={() => {
            currentIndex.set(0);
          }}
          stroke={strokeColor}
        />
      </View>
      <View
        style={{
          height: 50,
        }}
      >
        <StackedButton.Provider
          currentIndex={currentIndex}
          itemStyles={{
            borderRadius: 25,
            borderCurve: "continuous",
            alignItems: "center",
            justifyContent: "center",
            height: 50,
            paddingVertical: 16,
          }}
          gap={12}
          initialIndex={1}
        >
          <StackedButton.Container>
            <ThemedViewWrapper colorName="white" alphaHex={isDark ? "20" : ""}>
              <ButtonItem
                expandedElement={
                  <ButtonCluster
                    type="semiBold"
                    text="Cancel"
                    style={styles.btnText}
                    colorName={"background"}
                  />
                }
                expandedStyle={textStyle}
                //   childStyle={fgStyle}
                onPress={handleCancel}
                handleConfirmation={handleReset}
              >
                <ButtonCluster
                  text="Reset"
                  icon={
                    <ButtonIcon icon={RotateCw} size={20} colorName="text" />
                  }
                  type="semiBold"
                  style={styles.btnText}
                  colorName="text"
                />
              </ButtonItem>
            </ThemedViewWrapper>
            <ThemedViewWrapper colorName="text">
              <ButtonItem
                expandedElement={
                  <ButtonCluster
                    text="Confirm Signature"
                    icon={
                      <ButtonIcon
                        icon={Stamp}
                        size={20}
                        colorName="background"
                      />
                    }
                    type="semiBold"
                    style={styles.btnText}
                    colorName="background"
                  />
                }
                handleConfirmation={handleConfirmExpand}
                onPress={handleConfirm}
              >
                <ButtonCluster
                  text="Confirm"
                  icon={
                    <ButtonIcon icon={Stamp} size={19} colorName="background" />
                  }
                  type="semiBold"
                  ellipsizeMode="clip"
                  style={styles.btnText}
                  colorName="background"
                />
              </ButtonItem>
            </ThemedViewWrapper>
          </StackedButton.Container>
        </StackedButton.Provider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 16,
    paddingHorizontal: 2,
  },
});
