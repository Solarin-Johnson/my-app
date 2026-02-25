import { View, StyleSheet } from "react-native";
import React from "react";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import PressableBounce from "../PresableBounce";
import UntitledButton from "./button";
import { Play } from "lucide-react-native";
import { ThemedViewWrapper } from "../ThemedView";
import {
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { StackedButton, StackedButtonItemProps } from "../stacked-button";

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
          <View style={styles.info}>
            <View style={styles.details}>
              <ThemedText type="semiBold" style={styles.title}>
                {name}
              </ThemedText>
              <View style={styles.cluster}>
                <ThemedTextWrapper style={styles.fade}>
                  <Ionicons name="lock-closed-outline" size={14} />
                </ThemedTextWrapper>
                <ThemedText
                  type="regular"
                  style={[styles.subtitle, styles.fade]}
                >
                  {author}
                </ThemedText>
                <ThemedTextWrapper>
                  <Ionicons name="ellipsis-horizontal-sharp" size={14} />
                </ThemedTextWrapper>
              </View>
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
  tracks = 12,
  durationMs = 310000,
  scrolling,
}: {
  name?: string;
  author?: string;
  tracks?: number;
  durationMs?: number;
  scrolling?: SharedValue<boolean>;
}) => {
  const initialIndex = 1;
  const currentIndex = useSharedValue(0);

  useAnimatedReaction(
    () => scrolling?.value,
    (value) => {
      if (value) {
        currentIndex.value = initialIndex;
      }
    },
  );

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <View>
      <View style={styles.content}>
        <View style={[styles.box, styles.boxLarge]}></View>
        <View style={styles.info}>
          <View style={[styles.details, styles.detailsLarge]}>
            <ThemedText
              type="semiBold"
              style={[styles.titleLarge, styles.fade]}
            >
              {name}
            </ThemedText>
            <View style={styles.cluster}>
              <ThemedTextWrapper style={styles.fade}>
                <Ionicons name="lock-closed-outline" size={14} />
              </ThemedTextWrapper>
              <ThemedText type="regular" style={[styles.subtitle, styles.fade]}>
                {`${author} • ${tracks} tracks • ${formatDuration(durationMs)}`}
              </ThemedText>
            </View>
          </View>
          <ThemedViewWrapper colorName="text">
            <UntitledButton themed={false}>
              <ThemedTextWrapper colorName="background">
                <Ionicons name="play" size={18} color="white" />
              </ThemedTextWrapper>
            </UntitledButton>
          </ThemedViewWrapper>
        </View>
        <StackedButton.Provider
          currentIndex={currentIndex}
          itemStyles={{
            backgroundColor: "#88888818",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
            borderCurve: "continuous",
            alignItems: "center",
          }}
          initialIndex={initialIndex}
          gap={8}
        >
          <StackedButton.Container
            style={{ width: "100%", paddingVertical: 16 }}
          >
            <ButtonItem expandedElement={<ThemedText>Convert</ThemedText>}>
              <ThemedText>Convert</ThemedText>
            </ButtonItem>
            <ButtonItem
              onPress={() => {
                console.log("Pressed");
              }}
              disableExpand
            >
              <ThemedText>Import</ThemedText>
            </ButtonItem>
            <ButtonItem disableExpand>
              <ThemedText>Record</ThemedText>
            </ButtonItem>
          </StackedButton.Container>
        </StackedButton.Provider>
      </View>
    </View>
  );
};

const ButtonItem = ({ children, ...rest }: StackedButtonItemProps) => {
  return (
    <StackedButton.Item {...rest} asChild>
      <PressableBounce bounceScale={0.98}>{children}</PressableBounce>
    </StackedButton.Item>
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
  info: {
    flexDirection: "row",
    width: "100%",
    marginTop: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 17.2,
  },
  titleLarge: {
    fontSize: 28,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    flex: 1,
  },
  fade: {
    opacity: 0.65,
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
    gap: 4,
    flex: 1,
  },
  detailsLarge: {
    gap: 8,
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
