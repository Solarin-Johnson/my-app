import { View, Text, StyleSheet } from "react-native";
import React, { useRef } from "react";
import { ThemedView, ThemedViewWrapper } from "../ThemedView";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ReCaptchaProps } from "./config";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import Button from "../ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { Headphones, Info, RotateCw } from "lucide-react-native";
import PressableBounce from "../PresableBounce";
import DrawPad, { DrawPadHandle } from "expo-drawpad";
import { Feedback } from "@/functions";
import Dots from "../ui/dots";
import UnderlayText from "./underlay-text";
import { useThemeColor } from "@/hooks/useThemeColor";
import Shimmer from "./shimmer";

const AnimatedThemedView = Animated.createAnimatedComponent(ThemedView);
const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText);
const AnimatedThemedViewWrapper =
  Animated.createAnimatedComponent(ThemedViewWrapper);

const TRAY_HEIGHT = 320;

export default function Tray({ shrinkProgress, isVerified }: ReCaptchaProps) {
  const padRef = useRef<DrawPadHandle>(null);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: shrinkProgress.value,
      marginTop: (shrinkProgress.value - 1) * TRAY_HEIGHT,
      transform: [
        {
          translateY: (1 - shrinkProgress.value) * TRAY_HEIGHT * 1.2,
        },
      ],
    };
  });
  const text = useThemeColor("text");
  const isVerifying = useSharedValue(false);

  const iconProps = {
    size: 16,
    strokeWidth: 2.7,
  };

  const handleResetPad = () => {
    padRef.current?.erase();
    Feedback.medium();
  };

  const dotAnimatedStyle = useAnimatedStyle(() => {
    return {
      zIndex: isVerifying.value ? 10 : 0,
    };
  });

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    return {
      zIndex: isVerifying.value ? 0 : -1,
    };
  });

  const btnAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: isVerifying.value ? 0.5 : 1,
    };
  });

  function getBtnTextAnimatedStyle(show: boolean) {
    return useAnimatedStyle(() => ({
      opacity: withTiming(isVerifying.value === show ? 1 : 0, {
        duration: 100,
      }),
    }));
  }
  const btnText1AnimatedStyle = getBtnTextAnimatedStyle(false);
  const btnText2AnimatedStyle = getBtnTextAnimatedStyle(true);

  const handleVerify = () => {
    Feedback.medium();
    isVerifying.value = true;
    setTimeout(() => {
      isVerifying.value = false;
      isVerified.value = true;
      Feedback.success();
    }, 1500);
  };

  return (
    <AnimatedThemedView
      style={[styles.container, animatedStyle]}
      colorName="captchaCardBg"
    >
      <ThemedView style={[styles.content, styles.shadow]} colorName="captchaBg">
        <Animated.View style={[styles.underLay, dotAnimatedStyle]}>
          <ThemedTextWrapper>
            <Dots dotSize={0.4} spacing={10} />
          </ThemedTextWrapper>
        </Animated.View>
        <ThemedText style={[styles.title, styles.roundText]}>
          Connect the Numbers in Order
        </ThemedText>
        <ThemedText style={[styles.fadeText, styles.roundText]}>
          (1 to 8)
        </ThemedText>
        <View style={styles.pad}>
          <View style={StyleSheet.absoluteFill}>
            <ThemedTextWrapper>
              <UnderlayText />
            </ThemedTextWrapper>
          </View>
          <DrawPad ref={padRef} stroke={text} />
          <Animated.View
            style={[StyleSheet.absoluteFill, shimmerAnimatedStyle]}
          >
            <ThemedTextWrapper colorName="captchaBg">
              <Shimmer isPlaying={isVerifying} rotateDeg="135deg" />
            </ThemedTextWrapper>
          </Animated.View>
        </View>
      </ThemedView>
      <View style={styles.footer}>
        <View style={styles.toolBar}>
          <IconButton onPress={handleResetPad}>
            <RotateCw {...iconProps} />
          </IconButton>
          <IconButton>
            <Headphones {...iconProps} />
          </IconButton>
          <IconButton>
            <Info {...iconProps} />
          </IconButton>
        </View>
        <AnimatedThemedViewWrapper
          colorName="systemBlue"
          style={[styles.verifyButton, btnAnimatedStyle]}
        >
          <PressableBounce onPress={handleVerify} bounceScale={0.98}>
            <AnimatedThemedText
              style={[
                styles.roundText,
                styles.verifyText,
                btnText1AnimatedStyle,
              ]}
            >
              Verify
            </AnimatedThemedText>
            <AnimatedThemedText
              style={[
                styles.roundText,
                styles.verifyText,
                btnText2AnimatedStyle,
              ]}
            >
              Verifying
            </AnimatedThemedText>
          </PressableBounce>
        </AnimatedThemedViewWrapper>
      </View>
    </AnimatedThemedView>
  );
}

type IconButtonProps = {
  children: React.ReactElement;
  onPress?: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({ children, onPress }) => (
  <ThemedViewWrapper
    style={[styles.iconButton, styles.shadow]}
    colorName="captchaBg"
  >
    <PressableBounce onPress={onPress}>
      <ThemedTextWrapper colorName="systemBlue">{children}</ThemedTextWrapper>
    </PressableBounce>
  </ThemedViewWrapper>
);

const styles = StyleSheet.create({
  container: {
    width: 310,
    height: TRAY_HEIGHT,
    borderRadius: 20,
    borderCurve: "continuous",
    padding: 4,
    paddingBottom: 0,
    boxShadow: "0 15px 20px -5px rgba(0,0,0,0.12)",
  },
  roundText: {
    fontFamily: "ui-rounded",
  },
  content: {
    flex: 1,
    borderRadius: 16,
    borderCurve: "continuous",
    padding: 12,
  },
  footer: {
    padding: 12,
    flexDirection: "row",
  },
  title: {
    fontWeight: "600",
    fontSize: 17,
  },
  fadeText: {
    opacity: 0.4,
    fontSize: 12,
    letterSpacing: -0.4,
    fontWeight: "500",
    marginTop: 2,
  },
  shadow: {
    boxShadow: "1px 1px 1px rgba(0,0,0,0.05)",
  },
  toolBar: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  iconButton: {
    width: 38,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
  },
  verifyButton: {
    width: 100,
    paddingVertical: 8,
    borderRadius: 30,
    borderCurve: "continuous",
    justifyContent: "center",
    alignItems: "center",
  },
  verifyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    position: "absolute",
  },
  pad: {
    flex: 1,
  },
  underLay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
});
