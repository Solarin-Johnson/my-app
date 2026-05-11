import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
} from "react-native";
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
  Undo,
  X,
} from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router, Stack } from "expo-router";
import { ThemedTextWrapper } from "@/components/ThemedText";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Sheet() {
  const { top } = useSafeAreaInsets();
  console.log("top", top);
  const currentIndex = useSharedValue(0);
  const padRef = useRef<DrawPadHandle>(null);

  const appleRed = useThemeColor("appleRed");
  const bg = useThemeColor("untitledBg");
  const text = useThemeColor("text");
  const isDark = useColorScheme() === "dark";
  const pathLength = useSharedValue(0);

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

  const handleUndo = () => {
    if (currentIndex.value === 2) {
      currentIndex.value = 0;
      return;
    }
    if (padRef.current) {
      padRef.current.undo();
    }
  };

  const handleConfirmExpand = () => {};

  const undoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withSpring(pathLength.value > 0 ? 1 : 0.5),
  }));

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <AnimatedPressable
              onPress={handleUndo}
              style={[
                {
                  width: 36,
                  height: 36,
                  borderRadius: 25,
                  alignItems: "center",
                  justifyContent: "center",
                },
                undoAnimatedStyle,
              ]}
            >
              <ThemedTextWrapper>
                <Undo size={24} color="currentColor" />
              </ThemedTextWrapper>
            </AnimatedPressable>
          ),
        }}
      />
      <View style={{ flex: 1, paddingTop: top, padding: 26, gap: 12 }}>
        <View
          style={{ flex: 1 }}
          onTouchStart={() => {
            if (currentIndex.get() === 2) {
              currentIndex.value = 0;
            }
          }}
        >
          <DrawPad
            ref={padRef}
            pathLength={pathLength}
            onDrawStart={() => {
              currentIndex.set(0);
            }}
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
              <ThemedViewWrapper
                colorName="white"
                alphaHex={isDark ? "20" : ""}
              >
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
                      <ButtonIcon
                        icon={Stamp}
                        size={19}
                        colorName="background"
                      />
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
    </>
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
