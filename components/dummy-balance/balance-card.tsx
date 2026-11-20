import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useRef, useState } from "react";
import Rotate3d, { Rotate3dHandle } from "@/components/3dRotate";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
import { ThemedView, ThemedViewWrapper } from "@/components/ThemedView";
import { SPRING_CONFIG } from "@/constants";
import { useThemeColor } from "@/hooks/useThemeColor";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HEIGHT = 180;
const TELEPORTED_HEIGHT = 240;

export default function BalanceCard() {
  const rotateRef = useRef<Rotate3dHandle>(null);
  const [teleport, setTeleport] = useState(false);
  const cardRef = useAnimatedRef();
  const cord = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  const TELEPORTED_TOP_MARGIN =
    height / 2 - TELEPORTED_HEIGHT / 2 - (bottom + top);

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
      marginTop: withSpring(
        teleport ? TELEPORTED_TOP_MARGIN : 0,
        SPRING_CONFIG,
      ),
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
            zIndex: 999,
            position: teleport ? "absolute" : "relative",
          },
        ]}
        pointerEvents={teleport ? "box-none" : "auto"}
      >
        <Animated.View style={cardInnerAnimatedStyle}>
          <Rotate3d
            axis="y"
            perspective={700}
            rtl={!teleport}
            ref={rotateRef}
            style={styles.rotateCard}
            itemStyle={styles.itemStyle}
            frontHeight={HEIGHT}
            backHeight={TELEPORTED_HEIGHT}
            frontContent={
              <FrontContent
                goForward={() => rotateRef.current?.flipTo("back")}
              />
            }
            backContent={
              <BackContent goBack={() => rotateRef.current?.flipTo("front")} />
            }
          />
        </Animated.View>
      </AnimatedPressable>
    </Portal>
  );
}

const ItemWrapper = ({
  children,
  style,
  face = "front",
}: {
  children?: React.ReactNode;
  style?: any;
  face?: "front" | "back";
}) => {
  const text = useThemeColor("text");
  const itemStyle = { borderColor: text + "24" };
  return (
    <ThemedView
      colorName="text"
      style={[styles.itemStyle, itemStyle, style]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.underlay,
          { transform: [{ rotateY: face === "front" ? "0deg" : "180deg" }] },
        ]}
      />
      {children}
    </ThemedView>
  );
};

const FrontContent = ({ goForward }: { goForward: () => void }) => (
  <ItemWrapper face="front" style={styles.frontCard}>
    <Text>Front Content</Text>
    <ThemedText
      style={{ fontFamily: "ui-monospace", fontWeight: 700 }}
      colorName="black"
      type="title"
    >
      USD 14,580.00
    </ThemedText>
    <Text onPress={goForward}>Go to Back</Text>
  </ItemWrapper>
);

const BackContent = ({ goBack }: { goBack: () => void }) => (
  <ItemWrapper face="back" style={styles.backCard}>
    <Text>Back Content</Text>
    <Text onPress={goBack}>Go to Front</Text>
  </ItemWrapper>
);

const styles = StyleSheet.create({
  rotateCard: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  frontCard: {
    flex: 1,
    // backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  backCard: {
    flex: 1,
    // backgroundColor: "lightcoral",
    alignItems: "center",
    justifyContent: "center",
  },
  itemStyle: {
    overflow: "hidden",
    borderRadius: 24,
    borderCurve: "continuous",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.25,
  },
  underlay: {
    ...StyleSheet.absoluteFill,
    experimental_backgroundImage:
      "linear-gradient(135deg, rgba(255,255,255,0.1) 5%, rgba(0,0,0,0.1) 95%)",
  },
});
