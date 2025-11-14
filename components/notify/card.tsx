import { ScrollView, StyleSheet, TextInput } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedViewWrapper } from "../ThemedView";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

type CardGlobalProps = {
  shown: SharedValue<boolean>;
};

const useOpacityAnimation = (shown: SharedValue<boolean>) => {
  return useAnimatedStyle(() => {
    return {
      opacity: withSpring(shown.value ? 1 : 0),
    };
  });
};

export const CardPeek = ({
  text,
  shown,
}: { text: string } & CardGlobalProps) => {
  const animatedStyle = useOpacityAnimation(shown);

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
    <BlurView style={styles.header} intensity={10}>
      <ThemedText style={styles.text}>{title}</ThemedText>
    </BlurView>
  );
};

export const CardExpanded = ({
  children,
  shown,
}: { children?: React.ReactNode } & CardGlobalProps) => {
  const animatedStyle = useOpacityAnimation(shown);

  return (
    <Animated.View style={[styles.expandedContainer, animatedStyle]}>
      <ScrollView style={styles.expanded} scrollIndicatorInsets={{ top: 48 }}>
        <TextInput placeholder="Type your message here..." />
        {children}
      </ScrollView>
      <CardHeader title="Details" />
    </Animated.View>
  );
};

export const CardHandle = ({ shown }: CardGlobalProps) => {
  const animatedStyle = useOpacityAnimation(shown);

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
  text: {},
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
  expandedContainer: {
    ...StyleSheet.absoluteFillObject,
    margin: 1,
    overflow: "hidden",
    borderRadius: 24,
    borderCurve: "continuous",
  },
});
