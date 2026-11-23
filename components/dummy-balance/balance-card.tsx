import {
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  TextInput,
  TextInputInstance,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import Rotate3d, { Rotate3dHandle } from "@/components/3dRotate";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { Portal } from "react-native-teleport";
import Animated, {
  measure,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";
import { ThemedView, ThemedViewWrapper } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useKeyboardState } from "react-native-keyboard-controller";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HEIGHT = 160;
const TELEPORTED_HEIGHT = 240;

const SPRING_CONFIG: WithSpringConfig = {
  damping: 45,
  stiffness: 300,
  mass: 2.5,
};

const BALANCE = 12480;

export default function BalanceCard() {
  const rotateRef = useRef<Rotate3dHandle>(null);
  const [teleport, setTeleport] = useState(false);
  const dummyBalance = useSharedValue<string | null>(null);
  const cardRef = useAnimatedRef();
  const cord = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });
  const { height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const { isVisible: keyboardVisible, height: keyboardHeight } =
    useKeyboardState();

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
        teleport
          ? TELEPORTED_TOP_MARGIN - (keyboardVisible ? keyboardHeight / 3 : 0)
          : 0,
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
        {
          <ThemedViewWrapper>
            <AnimatedPressable style={styles.overlay} onPress={closeContext} />
          </ThemedViewWrapper>
        }
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
              frontContent={<FrontContent dummyBalance={dummyBalance} />}
              backContent={
                <BackContent teleport={teleport} dummyBalance={dummyBalance} />
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

const FrontContent = ({
  dummyBalance,
}: {
  dummyBalance: SharedValue<string | null>;
}) => {
  const visibleBalance = useDerivedValue(() => {
    const dv = dummyBalance.value;
    return ((dv && Number(dv)) ?? BALANCE).toLocaleString("en-NG", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      currencyDisplay: "code",
    });
  });
  return (
    <ItemWrapper face="front" style={styles.frontCard}>
      <ThemedText style={styles.frontLabel} colorName="background">
        Balance
      </ThemedText>
      <ThemedTextWrapper style={styles.frontBalance} colorName="background">
        <Animated.Text>{visibleBalance}</Animated.Text>
      </ThemedTextWrapper>
      {/* <ThemedText onPress={goForward} colorName="background">
      Go to Back
    </ThemedText> */}
    </ItemWrapper>
  );
};

const BackContent = ({
  teleport,
  dummyBalance,
}: {
  teleport: boolean;
  dummyBalance: SharedValue<string | null>;
}) => (
  <ItemWrapper face="back" style={styles.backCard}>
    <ThemedText
      style={[styles.sectionLabel, { textAlign: "center" }]}
      colorName="background"
    >
      Dummy Balance
    </ThemedText>
    <Divider />
    <Screen focus={teleport} dummyBalance={dummyBalance} />
    <Divider />
    <Section title="Balance">
      <ThemedText colorName="background" style={styles.backBalance}>
        {BALANCE.toLocaleString("en-NG", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        })}
      </ThemedText>
    </Section>
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

const Screen = ({
  focus,
  dummyBalance,
}: {
  focus: boolean;
  dummyBalance: SharedValue<string | null>;
}) => {
  const bg = useThemeColor("background");
  const inputRef = useRef<TextInputInstance>(null);
  const [amount, setAmount] = useState<string | null>(null);

  console.log(amount);

  const handleChangeText = (text: string) => {
    const value = text.replace(/[^0-9.]/g, "");

    if (!value) {
      setAmount(null);
      return;
    }

    const [integer, ...decimals] = value.split(".");

    const whole = integer.slice(0, 6);
    const decimal = decimals.join("").slice(0, 2);

    const formatted = new Intl.NumberFormat("en-NG", {
      maximumFractionDigits: 0,
    }).format(Number(whole));

    const nextAmount = value.includes(".")
      ? `${formatted}.${decimal}`
      : formatted;

    setAmount(nextAmount);
  };

  const integer = amount?.split(".")[0];
  const decimal = amount?.split(".")[1] || "";

  const tenth = decimal[0];
  const hundredth = decimal[1];
  const hasDot = amount?.includes(".");

  useEffect(() => {
    const autoFocus = () => {
      if (focus && amount === null) {
        inputRef.current?.focus();
      } else {
        inputRef.current?.blur();
      }
    };
    autoFocus();
    return () => {
      inputRef.current?.blur();
    };
  }, [focus]);

  useEffect(() => {
    const v = amount?.replace(/,/g, "");
    dummyBalance.set(v ?? null);
  }, [amount, focus]);

  return (
    <Pressable
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() => {
        inputRef.current?.focus();
      }}
    >
      <View style={styles.screenTextWrapper}>
        <ThemedText
          style={[styles.screenText, !integer && styles.textFade]}
          colorName="background"
          pointerEvents="none"
        >
          {integer || "0"}
        </ThemedText>
        <ThemedText
          style={[styles.screenText, !hasDot && styles.textFade]}
          colorName="background"
          pointerEvents="none"
        >
          {"."}
        </ThemedText>
        <ThemedText
          style={[styles.screenText, !tenth && styles.textFade]}
          colorName="background"
          pointerEvents="none"
        >
          {tenth ?? "0"}
        </ThemedText>
        <ThemedText
          style={[styles.screenText, !hundredth && styles.textFade]}
          colorName="background"
          pointerEvents="none"
        >
          {hundredth ?? "0"}
        </ThemedText>
      </View>
      <TextInput
        ref={inputRef}
        value={amount || "0"}
        placeholder="0.00"
        selectionColor={"red"}
        keyboardType="decimal-pad"
        maxLength={10}
        placeholderTextColor={bg + "60"}
        onChangeText={handleChangeText}
        style={styles.screenTextInput}
      />
    </Pressable>
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
    letterSpacing: -0.2,
    opacity: 0.7,
  },
  screenTextWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  screenText: {
    fontFamily: "KodeMonoSemiBold",
    fontVariant: ["tabular-nums"],
    fontSize: 54,
    textAlign: "center",
  },
  screenTextInput: {
    width: "100%",
    height: "100%",
    opacity: 0,
  },
  textFade: {
    opacity: 0.5,
  },
});
