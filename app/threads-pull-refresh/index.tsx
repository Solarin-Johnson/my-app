import { StyleSheet } from "react-native";
import React from "react";
import RefreshLogo from "@/components/RefreshLogo";
import Animated from "react-native-reanimated";
import {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ThreadPullRefresh() {
  const scrollY = useSharedValue(0);
  const { top } = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <Animated.ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: top }}
      onScroll={scrollHandler}
    >
      <RefreshLogo scrollY={scrollY} maxScrollY={100} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
