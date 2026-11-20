import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Rotate3d, { Rotate3dHandle } from "@/components/3dRotate";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { Portal } from "react-native-teleport";
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";
import { ThemedViewWrapper } from "@/components/ThemedView";
import { SPRING_CONFIG } from "@/constants";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function index() {
  const rotateRef = useRef<Rotate3dHandle>(null);
  const [teleport, setTeleport] = useState(false);
  const cardRef = useAnimatedRef();
  const cord = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });

  const measureCard = () => {
    scheduleOnUI(() => {
      const m = measure(cardRef);
      if (m) {
        cord.value = {
          x: m.pageX,
          y: m.pageY,
          width: m.width,
          height: m.height,
        };
      }
    });
  };

  const cardAnimatedStyle = useAnimatedStyle(() => {
    if (!teleport)
      return {
        left: 0,
        top: 0,
        width: "auto",
        height: 180,
      };
    return {
      left: cord.value.x,
      top: cord.value.y,
      width: cord.value.width,
      height: cord.value.height,
    };
  });

  const cardInnerAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: withSpring(teleport ? 200 : 0, SPRING_CONFIG),
    };
  });

  const openContext = () => {
    measureCard();
    rotateRef.current?.flipTo("back");
    setTeleport(true);
  };

  const closeContext = () => {
    rotateRef.current?.flipTo("front");
    setTeleport(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText>index</ThemedText>
      <Portal hostName={teleport ? "dummy-balance-overlay" : undefined}>
        <ThemedViewWrapper>
          <AnimatedPressable style={styles.overlay} onPress={closeContext} />
        </ThemedViewWrapper>
        <AnimatedPressable
          ref={cardRef}
          onLongPress={openContext}
          style={[
            cardAnimatedStyle,
            {
              zIndex: teleport ? 999 : 0,
              position: teleport ? "absolute" : "relative",
            },
          ]}
          pointerEvents={teleport ? "box-none" : "auto"}
        >
          <Animated.View style={cardInnerAnimatedStyle}>
            <Rotate3d
              axis="y"
              perspective={900}
              rtl={false}
              ref={rotateRef}
              style={styles.rotateCard}
              itemStyle={styles.itemStyle}
              frontContent={
                <FrontContent
                  goForward={() => rotateRef.current?.flipTo("back")}
                />
              }
              backContent={
                <BackContent
                  goBack={() => rotateRef.current?.flipTo("front")}
                />
              }
            />
          </Animated.View>
        </AnimatedPressable>
      </Portal>
    </SafeAreaView>
  );
}

const FrontContent = ({ goForward }: { goForward: () => void }) => (
  <View style={styles.frontCard}>
    <Text>Front Content</Text>
    <ThemedText
      style={{ fontFamily: "ui-monospace", fontWeight: 700 }}
      colorName="black"
      type="title"
    >
      USD 14,580.00
    </ThemedText>
    <Text onPress={goForward}>Go to Back</Text>
  </View>
);

const BackContent = ({ goBack }: { goBack: () => void }) => (
  <View style={styles.backCard}>
    <Text>Back Content</Text>
    <Text onPress={goBack}>Go to Front</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  rotateCard: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  frontCard: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  backCard: {
    flex: 1,
    backgroundColor: "lightcoral",
    alignItems: "center",
    justifyContent: "center",
  },
  itemStyle: {
    overflow: "hidden",
    borderRadius: 18,
    borderCurve: "continuous",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.25,
  },
});
