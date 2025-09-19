import {
  View,
  StyleSheet,
  GestureResponderEvent,
  Pressable,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { applySpring, CLOSED_HEIGHT } from "./config";
import { Ellipsis, X } from "lucide-react-native";
// import { Button, ContextMenu, Host, Text as UIText } from "@expo/ui/swift-ui";

export type ItemProps = {
  opened: SharedValue<boolean>;
  modal?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Dp = ({
  opened,
  modal,
  onClose,
}: ItemProps & {
  onClose?: (e: GestureResponderEvent) => void;
}) => {
  const dpAnimatedStyle = useAnimatedStyle(() => {
    if (!modal) return {};
    return {
      transform: [
        {
          scale: applySpring(opened.value ? 0.4 : 1),
        },
      ],
      opacity: applySpring(opened.value ? 0 : 1),
    };
  });

  const btnAnimatedStyle = useAnimatedStyle(() => {
    if (!modal) return {};
    return {
      opacity: applySpring(opened.value ? 0.7 : 0),
    };
  });

  return (
    <View style={styles.dpWrapper}>
      <Animated.View style={dpAnimatedStyle}>
        <Image
          source={require("../../assets/images/dp.png")}
          style={styles.dp}
        />
      </Animated.View>
      {modal && (
        <AnimatedPressable
          style={[styles.closeBtn, btnAnimatedStyle]}
          onPress={onClose}
        >
          <ThemedTextWrapper>
            <X size={23} />
          </ThemedTextWrapper>
        </AnimatedPressable>
      )}
    </View>
  );
};

const InfoBar = ({ name, tabs }: { name: string; tabs: number }) => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ThemedText type="defaultSemiBold" style={styles.nameText}>
        {name}
      </ThemedText>
      <ThemedText style={styles.tabsText}>{`${tabs} tabs`}</ThemedText>
    </View>
  );
};

const BarOptions = ({ opened, modal }: ItemProps) => {
  if (!modal) return null;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: applySpring(opened.value ? 1 : 0.5),
        },
      ],
      opacity: applySpring(opened.value ? 1 : 0),
    };
  });

  return (
    <AnimatedPressable
      style={[{ paddingHorizontal: 14 }, animatedStyle]}
      hitSlop={16}
    >
      <ThemedTextWrapper>
        <Ellipsis size={21} />
      </ThemedTextWrapper>
    </AnimatedPressable>
  );
};

export { Dp, InfoBar, BarOptions };

const styles = StyleSheet.create({
  dpWrapper: {
    padding: 4,
    width: CLOSED_HEIGHT,
    height: CLOSED_HEIGHT,
    aspectRatio: 1,
  },
  dp: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: "50%",
    borderBottomRightRadius: 5,
  },
  nameText: {
    fontSize: 15.8,
    letterSpacing: -0.3,
  },
  tabsText: {
    opacity: 0.7,
    fontSize: 12.5,
    letterSpacing: -0.25,
  },
  closeBtn: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 6,
  },
});
