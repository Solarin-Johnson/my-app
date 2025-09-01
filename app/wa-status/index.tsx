import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link } from "expo-router";
import { Ellipsis } from "lucide-react-native";

export default function Index() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <ClusterContainer>
        <ClusterItem />
        <ClusterItem />
      </ClusterContainer>
    </ScrollView>
  );
}

interface ClusterContainerProps {
  children: ReactNode;
}

const ClusterContainer = ({ children }: ClusterContainerProps) => {
  return (
    <ThemedView colorName="waCard" style={styles.clusterContainer}>
      {children}
    </ThemedView>
  );
};

interface ClusterItemProps {
  imgSrc?: string;
  views?: number;
  time?: string;
}

const ClusterItem = ({
  imgSrc = "https://wallpapercave.com/wp/wp3161438.jpg",
  views = 24,
  time = "1h ago",
}: ClusterItemProps) => {
  return (
    <Link href="/wa-status/123">
      <ThemedView colorName="waCard" style={styles.clusterItem}>
        <View style={styles.thumbContainer}>
          <Image
            source={{
              uri: imgSrc,
            }}
            style={styles.thumb}
          />
        </View>
        <View style={styles.contentWrapper}>
          <View style={styles.main}>
            <ThemedText style={styles.views}>
              {views} view{views !== 1 ? "s" : ""}
            </ThemedText>
            <ThemedText type="regular" style={styles.time}>
              {time}
            </ThemedText>
          </View>
          <ThemedTextWrapper>
            <Ellipsis />
          </ThemedTextWrapper>
        </View>
      </ThemedView>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  clusterContainer: {
    borderRadius: 12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  clusterItem: {
    // height: 72,
    flexDirection: "row",
  },
  thumbContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 12,
  },
  thumb: {
    width: 56,
    aspectRatio: 1,
    borderRadius: "50%",
  },
  contentWrapper: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#88888820",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 16,
  },
  main: {
    justifyContent: "center",
    flex: 1,
    gap: 2,
  },
  views: {
    fontSize: 17,
  },
  time: {
    opacity: 0.6,
  },
});
