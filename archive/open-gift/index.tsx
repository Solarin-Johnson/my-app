import { View, StyleSheet, Pressable } from "react-native";
import React, { useRef } from "react";
import Rotate3d, { Rotate3dHandle, Rotate3dProps } from "@/components/3dRotate";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import PressableBounce from "@/components/PresableBounce";
import { useSharedValue } from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ArrowLeft, RotateCcw } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import DrawPad, { DrawPadHandle } from "expo-drawpad";
import { Image, ImageBackground } from "expo-image";
import { GlassView } from "expo-glass-effect";
import { ThemedView } from "@/components/ThemedView";

export default function Index() {
  const rotateRef = useRef<Rotate3dHandle>(null);

  return (
    <ThemedView style={styles.container}>
      <Rotate3d
        ref={rotateRef}
        style={styles.rotateCard}
        frontContent={
          <FrontContent goForward={() => rotateRef.current?.flipTo("back")} />
        }
        backContent={
          <BackContent goBack={() => rotateRef.current?.flipTo("front")} />
        }
        axis="y"
      />
    </ThemedView>
  );
}

const ItemWrapper = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => {
  const text = useThemeColor("text");
  const itemStyle = { borderColor: text + "24" };
  return <View style={[styles.itemStyle, itemStyle, style]}>{children}</View>;
};

const FrontContent = ({ goForward }: { goForward: () => void }) => (
  <ItemWrapper style={styles.frontCard}>
    <Image
      source={require("@/assets/images/yellow_star.webp")}
      style={[
        StyleSheet.absoluteFill,
        { transform: [{ scale: 1.1 }, { rotate: "180deg" }], top: 20 },
      ]}
    />
    <Image
      source={require("@/assets/images/gift_box.webp")}
      style={styles.gift_box}
    />
    <Button onPress={goForward} title="Open Gift" />
  </ItemWrapper>
);

const BackContent = ({ goBack }: { goBack: () => void }) => {
  const padRef = useRef<DrawPadHandle>(null);
  const pathLength = useSharedValue<number>(0);
  const text = useThemeColor("slackText");

  const clearPad = () => {
    padRef.current?.erase();
  };

  return (
    <ItemWrapper style={styles.backCard}>
      <Button onPress={goBack} title="Close Gift" />
      <DrawPad ref={padRef} pathLength={pathLength} stroke={text} />
    </ItemWrapper>
  );
};

const Button = ({
  onPress,
  title,
}: {
  onPress?: () => void;
  title: string;
}) => {
  const text = useThemeColor("text");
  return (
    <GlassView isInteractive style={styles.buttonWrapper} tintColor="#E16250">
      <Pressable
        onPress={onPress}
        style={[styles.button, styles.buttonWrapper]}
      >
        <ThemedText type="semiBold" style={{ color: "#fff" }}>
          {title}
        </ThemedText>
      </Pressable>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rotateCard: {
    width: 320,
    height: 364,
    margin: 40,
  },
  itemStyle: {
    flex: 1,
    borderRadius: 30,
    borderCurve: "continuous",
    borderWidth: 1.8,
    boxShadow: "0 0px 8px rgba(0,0,0,0.05)",
    padding: 18,
    overflow: "hidden",
  },
  backCard: {
    borderStyle: "dashed",
    boxShadow: "none",
  },
  frontCard: {
    gap: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
  },
  gift_box: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
  },
  buttonWrapper: {
    borderRadius: 22,
    borderCurve: "continuous",
    width: "100%",
  },
  button: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
