import { View, StyleSheet } from "react-native";
import React from "react";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import ProgressiveFade from "@/components/ProgressiveFade";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "@/components/safari-bar/header";
import { DATA } from "@/components/safari-bar/config";
import Article from "@/components/safari-bar/article";
import Bar from "@/components/safari-bar/bar";

const FADE_HEIGHT = 4;
const { content, title, sections } = DATA;

export default function SafariBar() {
  const { top } = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const isScrollEnd = useSharedValue(true);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isScrollEnd.value = false;
      console.log("Drag begin");
    },
    onScroll: (event) => {
      isScrollEnd.value = false;
      scrollY.value = Math.max(0, event.contentOffset.y);
    },
    onEndDrag: () => {
      isScrollEnd.value = true;
      console.log("Drag end");
    },
  });
  return (
    <ThemedView style={{ flex: 1 }} colorName="safariBg">
      <Animated.FlatList
        ListHeaderComponent={() => (
          <Header title={title} content={content} onBackPress={() => {}} />
        )}
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: top + FADE_HEIGHT },
        ]}
        data={sections}
        renderItem={({ item, index }) => (
          <Article
            content={item.content}
            title={item.title}
            index={index + 1}
          />
        )}
        onScroll={scrollHandler}
        // scrollEventThrottle={16}
      />
      <ProgressiveFade direction="top" height={FADE_HEIGHT} />
      <Bar scrollY={scrollY} isScrollEnd={isScrollEnd} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    maxWidth: 640,
  },
  content: {
    paddingBottom: 20,
  },
  box: {
    height: 120,
    borderRadius: 10,
    width: "100%",
    backgroundColor: "#88888820",
  },
});
