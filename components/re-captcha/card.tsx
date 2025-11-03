import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";
import CheckBox from "../ui/check-box";
import { ThemedViewWrapper } from "../ThemedView";
import { Image } from "expo-image";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";

export default function CaptchaCard() {
  const checkBoxInitialColor = useThemeColor("barColor");
  const captchaCheckboxBg = useThemeColor("captchaCheckboxBg");
  return (
    <ThemedViewWrapper colorName="captchaCardBg">
      <Animated.View style={styles.card}>
        <View style={styles.content}>
          <CheckBox
            size={38}
            initialColor={checkBoxInitialColor}
            checkedColor={captchaCheckboxBg}
            style={styles.checkBox}
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
    width: 320,
    padding: 18,
    height: 74,
    backgroundColor: "#fff",
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
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
