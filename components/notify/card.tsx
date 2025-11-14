import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView, ThemedViewWrapper } from "../ThemedView";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type CardGlobalProps = {
  shown: SharedValue<boolean>;
};

export const CardPeek = ({
  text,
  shown,
}: { text: string } & CardGlobalProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(shown.value ? 1 : 0),
    };
  });
  return (
    <Animated.View
      style={[styles.container, styles.peekContainer, animatedStyle]}
    >
      <ThemedText style={styles.text}>{text}</ThemedText>
    </Animated.View>
  );
};

const CardHeader = ({ title }: { title: string }) => {
  return (
    <View style={styles.header}>
      <ThemedText style={styles.text}>{title}</ThemedText>
    </View>
  );
};

export const CardExpanded = ({ children }: { children?: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      <View style={styles.expanded}>{children}</View>
      <CardHeader title="Details" />
    </View>
  );
};

export const CardHandle = ({ shown }: CardGlobalProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: shown.value ? 1 : 0,
    };
  });
  return (
    <ThemedViewWrapper colorName="text">
      <Animated.View style={[styles.handle, animatedStyle]} />
    </ThemedViewWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  peekContainer: {
    justifyContent: "center",
    padding: 12,
  },
  text: {
    color: "white",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    borderCurve: "continuous",
    alignSelf: "center",
    position: "absolute",
    bottom: 6,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  expanded: {
    flex: 1,
    paddingTop: 48,
  },
});
