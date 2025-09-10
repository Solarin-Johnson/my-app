import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ThemedText";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useScreenAnimation } from "react-native-screen-transitions";

export interface UntitledHeaderProps {
  title?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export default function UntitledHeader({
  title,
  style,
  contentStyle,
  children,
}: UntitledHeaderProps) {
  const { top } = useSafeAreaInsets();
  const props = useScreenAnimation();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const {
      progress,
      layouts: {
        screen: { width },
      },
    } = props.value;

    return {
      opacity: interpolate(progress, [0, 1, 2], [0, 1, 0]),
      transform: [
        {
          translateX: interpolate(progress, [0, 1, 2], [-width, 0, width]),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: top + 20,
        },
        style,
        headerAnimatedStyle,
      ]}
    >
      <View style={[styles.header, contentStyle]}>
        {title && (
          <ThemedText type="defaultSemiBold" style={styles.title}>
            {title}
          </ThemedText>
        )}
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 23,
  },
});
