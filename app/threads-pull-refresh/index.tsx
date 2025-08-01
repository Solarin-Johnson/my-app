import { StyleSheet } from "react-native";
import React from "react";
import RefreshLogo from "@/components/RefreshLogo";
import Animated from "react-native-reanimated";
import {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const path =
  "M19.25 8.50488C17.6729 2.63804 12.25 3.00452 12.25 3.00452C12.25 3.00452 4.75 2.50512 4.75 12C4.75 21.4949 12.25 20.9955 12.25 20.9955C12.25 20.9955 16.7077 21.2924 18.75 17.0782C19.4167 15.2204 19.25 11.5049 12.75 11.5049C12.75 11.5049 9.75 11.5049 9.75 14.0049C9.75 14.9812 10.75 16.0049 12.25 16.0049C13.75 16.0049 15.4212 14.9777 15.75 13.0049C16.75 7.00488 11.25 6.50488 9.75 9.00488";

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
      <RefreshLogo scrollY={scrollY} maxScrollY={100} d={path} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
