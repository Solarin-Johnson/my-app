import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import CheckBox from "../ui/check-box";
import { ThemedViewWrapper } from "../ThemedView";
import { Image } from "expo-image";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";
import { ReCaptchaProps, SPRING_CONFIG } from "./config";
import { Feedback } from "@/functions";

export default function CaptchaCard({ shrinkProgress }: ReCaptchaProps) {
  const checkBoxInitialColor = useThemeColor("captchaCheckboxInitialBg");
  const captchaCheckboxBg = useThemeColor("captchaCheckboxBg");

  const animatedCardStyle = useAnimatedStyle(() => {
    const scale = 1 - shrinkProgress.value * 0.3;
    return {
      transform: [{ scale }],
    };
  });

  return (
    <ThemedViewWrapper colorName="captchaCardBg">
      <Animated.View style={[styles.card, animatedCardStyle]}>
        <View style={styles.content}>
          <CheckBox
            size={38}
            initialColor={checkBoxInitialColor}
            checkedColor={captchaCheckboxBg}
            style={styles.checkBox}
            onChange={(checked) => {
              Feedback.soft();
              shrinkProgress.value = withSpring(checked ? 1 : 0, SPRING_CONFIG);
            }}
          />
          <ThemedText style={styles.title} type="defaultSemiBold">
            I'm not a robot
          </ThemedText>
        </View>
        <View style={styles.captchLogo}>
          <Image
            source={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/ReCAPTCHA_icon.svg/512px-ReCAPTCHA_icon.svg.png"
            }
            style={styles.image}
          />
          <ThemedText style={styles.text}>reCAPTCHA</ThemedText>
        </View>
      </Animated.View>
    </ThemedViewWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 310,
    padding: 18,
    height: 74,
    backgroundColor: "#fff",
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    // transformOrigin: "bottom center",
  },
  image: {
    width: 48,
    aspectRatio: 1,
  },
  checkBox: {
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
  },
  captchLogo: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 5,
    marginTop: -5,
    fontFamily: "Menlo",
    opacity: 0.3,
  },
  content: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    opacity: 0.65,
    fontWeight: "600",
    fontFamily: "ui-rounded",
  },
});
