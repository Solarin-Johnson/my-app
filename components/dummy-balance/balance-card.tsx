import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Switch,
  TextInput,
} from "react-native";
import { useRef, useState } from "react";
import Rotate3d, { Rotate3dHandle } from "@/components/3dRotate";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { Portal } from "react-native-teleport";
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";
import { ThemedView, ThemedViewWrapper } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HEIGHT = 180;
const TELEPORTED_HEIGHT = 250;

const SPRING_CONFIG: WithSpringConfig = {
  damping: 45,
  stiffness: 300,
  mass: 2.5,
};

export default function BalanceCard() {
  const rotateRef = useRef<Rotate3dHandle>(null);
  const [teleport, setTeleport] = useState(false);
  const cardRef = useAnimatedRef();
  const cord = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

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
      height: HEIGHT,
    };
  });

  const cardInnerAnimatedStyle = useAnimatedStyle(() => {
    const TELEPORTED_TOP_MARGIN =
      height / 2 - cord.value.y - HEIGHT / 2 - bottom;
    return {
      marginTop: withSpring(
        teleport ? TELEPORTED_TOP_MARGIN : 0,
        SPRING_CONFIG,
      ),
    };
  });

  const openContext = () => {
    if (teleport) return;
    measureCard();
    rotateRef.current?.flipTo("back");
    setTeleport(true);
  };

  const closeContext = () => {
    rotateRef.current?.flipTo("front");
    setTeleport(false);
  };

  return (
    <View style={{ height: HEIGHT }}>
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
              rtl={!teleport}
              ref={rotateRef}
              style={styles.rotateCard}
              itemStyle={styles.itemStyle}
              frontHeight={HEIGHT}
              backHeight={TELEPORTED_HEIGHT}
              springConfig={SPRING_CONFIG}
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
    </View>
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
      colorName="invertedTheme"
      style={[styles.itemStyle, itemStyle, style]}
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
    <ThemedText style={styles.frontLabel} colorName="background">
      Balance
    </ThemedText>
    <ThemedText style={styles.frontBalance} colorName="background">
      USD 12,480.00
    </ThemedText>
    {/* <ThemedText onPress={goForward} colorName="background">
      Go to Back
    </ThemedText> */}
  </ItemWrapper>
);

const BackContent = ({ goBack }: { goBack: () => void }) => (
  <ItemWrapper face="back" style={styles.backCard}>
    {/* <Section title="Dummy Balance">
      <Switch value={true} onValueChange={() => {}} />
    </Section> */}
    <ThemedText
      style={[styles.sectionLabel, { textAlign: "center" }]}
      colorName="background"
    >
      Dummy Balance
    </ThemedText>
    <Divider />
    <Screen />
    <Divider />
    <Section title="Balance">
      <ThemedText colorName="background" style={styles.backBalance}>
        USD 12,480.00
      </ThemedText>
    </Section>
    {/* <Text onPress={goBack}>Go to Front</Text> */}
  </ItemWrapper>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => (
  <View style={styles.section}>
    <ThemedText style={styles.sectionLabel} colorName="background">
      {title}
    </ThemedText>
    {children}
  </View>
);

const Divider = () => (
  <ThemedView
    style={{
      height: 1,
      marginVertical: 12,
    }}
    colorName="background"
    alphaHex="30"
  />
);

const Screen = () => {
  const bg = useThemeColor("background");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ThemedTextWrapper style={styles.screenText} colorName="background">
        <TextInput
          placeholder="0.00"
          selectionColor={"red"}
          keyboardType="decimal-pad"
          maxLength={10}
          placeholderTextColor={bg + "60"}
        />
      </ThemedTextWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  rotateCard: {
    width: "100%",
    height: 180,
    alignItems: "flex-start",
  },
  frontCard: {
    justifyContent: "flex-end",
    paddingVertical: 16,
    paddingHorizontal: 24,
    height: HEIGHT,
  },
  frontLabel: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "ui-monospace",
    lineHeight: 20,
    opacity: 0.75,
  },
  frontBalance: {
    fontSize: 28,
    fontFamily: "KodeMonoSemiBold",
    fontVariant: ["tabular-nums"],
  },
  backCard: {
    paddingVertical: 18,
    height: TELEPORTED_HEIGHT,
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
    backgroundImage: "linear-gradient(50deg, transparent 10%, #88888850 100%)",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: "ui-monospace",
    fontWeight: "500",
    opacity: 0.7,
  },
  backBalance: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "ui-monospace",
    fontVariant: ["tabular-nums"],
    opacity: 0.7,
  },
  screenText: {
    fontFamily: "KodeMonoSemiBold",
    fontVariant: ["tabular-nums"],
    fontSize: 54,
    textAlign: "center",
    width: "100%",
    height: "100%",
  },
});
