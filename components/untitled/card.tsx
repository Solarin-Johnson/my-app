import { View, StyleSheet, Pressable } from "react-native";
import React from "react";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import PressableBounce from "../PresableBounce";

export const UntitledCardMini = ({
  name = "untitled project",
  author = "Dotjs",
}: {
  name?: string;
  author?: string;
}) => {
  return (
    <Link href="/untitled/1" asChild>
      <PressableBounce style={styles.container}>
        <View style={styles.content}>
          <View style={styles.box}></View>
          <View style={styles.details}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {name}
            </ThemedText>
            <View style={styles.cluster}>
              <ThemedTextWrapper style={styles.fade}>
                <Ionicons name="lock-closed-outline" size={14} />
              </ThemedTextWrapper>
              <ThemedText type="regular" style={[styles.subtitle, styles.fade]}>
                {author}
              </ThemedText>
              <ThemedTextWrapper>
                <Ionicons name="ellipsis-horizontal-sharp" size={14} />
              </ThemedTextWrapper>
            </View>
          </View>
        </View>
      </PressableBounce>
    </Link>
  );
};

export const UntitledCardMiniWrapper = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return <View style={styles.wrapper}>{children}</View>;
};

export const UntitledCardLarge = ({
  name = "untitled project",
  author = "Dotjs",
}: {
  name?: string;
  author?: string;
}) => {
  return (
    <View>
      <View style={styles.content}>
        <View style={[styles.box, styles.boxLarge]}></View>
        <View style={styles.details}>
          <ThemedText type="defaultSemiBold" style={styles.titleLarge}>
            {name}
          </ThemedText>
          <View style={styles.cluster}>
            <ThemedTextWrapper style={styles.fade}>
              <Ionicons name="lock-closed-outline" size={14} />
            </ThemedTextWrapper>
            <ThemedText type="regular" style={[styles.subtitle, styles.fade]}>
              {author}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "50%",
  },
  content: {
    marginHorizontal: 22,
    alignItems: "center",
  },
  title: {
    fontSize: 17.2,
  },
  titleLarge: {
    fontSize: 28,
    letterSpacing: -0.5,
    opacity: 0.7,
  },
  subtitle: {
    fontSize: 14,
    flex: 1,
  },
  fade: {
    opacity: 0.6,
  },
  boxWrapper: {
    borderRadius: 16,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  box: {
    width: "100%",
    flex: 1,
    aspectRatio: 1,
    borderRadius: 18,
    borderCurve: "continuous",
    experimental_backgroundImage: `linear-gradient(135deg, ${Colors.dark.untitledGradient2} 0%, ${Colors.dark.untitledGradient1} 80%)`,
    boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
  },
  boxLarge: {
    width: "90%",
    margin: 12,
  },
  details: {
    width: "100%",
    marginTop: 12,
    gap: 4,
  },
  cluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  wrapper: {
    padding: 10,
    rowGap: 22,
    // backgroundColor: "red",
    flexWrap: "wrap",
    flexDirection: "row",
  },
});
