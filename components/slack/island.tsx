import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import React, { useEffect } from "react";
import { GlassView } from "expo-glass-effect";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  BarButton,
  BarOptions,
  ButtonCluster,
  ButtonSeperator,
  ContentContainer,
  Dp,
  InfoBar,
  ItemProps,
  QuickActions,
} from ".";
import {
  CLOSED_HEIGHT,
  DATA,
  FULL_HEIGHT,
  OPENED_PAD,
  PADDING,
  applySpring,
} from "./config";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FileText, Layers, Settings, UserRound } from "lucide-react-native";

export type Cords = { x: number; y: number; width: number; height: number };

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

export default function Island({
  onPress,
  modal = false,
  containerRef,
  visible = true,
  cords,
  opened: openedProp,
  onClose,
}: {
  onPress?: (e: GestureResponderEvent) => void;
  onClose?: (e: GestureResponderEvent) => void;
  modal?: boolean;
  containerRef?: React.RefObject<any>;
  visible?: boolean;
  cords?: SharedValue<Cords>;
  opened?: SharedValue<boolean>;
}) {
  const { width } = useWindowDimensions();
  const FULL_WIDTH = width - PADDING * 2;
  const _opened = useSharedValue(false);
  const opened = openedProp || _opened;

  const sharedProp: ItemProps = {
    opened,
    modal,
  };

  useEffect(() => {
    opened.value = true;
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const { x, width } = cords?.value || {};
    const isOpened = opened.value;

    const modalStyle: StyleProp<ViewStyle> = modal
      ? {
          position: "absolute",
          left: applySpring(isOpened ? PADDING : x || 0),
          width: applySpring(isOpened ? FULL_WIDTH : width || 0),
          height: applySpring(isOpened ? FULL_HEIGHT : CLOSED_HEIGHT),
          paddingTop: applySpring(isOpened ? OPENED_PAD : 0),
        }
      : {};
    return {
      opacity: visible ? 1 : 0,
      ...modalStyle,
    };
  });

  return (
    <AnimatedGlassView
      glassEffectStyle="regular"
      isInteractive
      style={[styles.glass, animatedStyle]}
      // tintColor={"#ffffff08"}
    >
      <Animated.View style={{ flex: 1, overflow: "hidden" }}>
        <Pressable onPress={onPress} style={styles.topBar} ref={containerRef}>
          <Dp {...sharedProp} onClose={onClose} />
          <InfoBar name={DATA.name} tabs={DATA.tabs} />
          <BarOptions {...sharedProp} />
        </Pressable>
        <ContentContainer {...sharedProp}>
          <QuickActions />
          <ButtonCluster>
            <BarButton
              icon={<Ionicons name="chatbubbles" size={21} />}
              label="Messages"
              active
              onPress={onClose}
            />
            <BarButton
              icon={<Layers size={21} strokeWidth={1.9} />}
              label="Files"
              onPress={onClose}
            />
            <BarButton
              icon={<FileText size={21} strokeWidth={1.9} />}
              label="Canvas"
              onPress={onClose}
            />
            <ButtonSeperator />
            <BarButton
              icon={<UserRound size={21} strokeWidth={1.9} />}
              label="Call"
              rightButton
              onPress={onClose}
            />
            <BarButton
              icon={<Settings size={21} strokeWidth={1.9} />}
              label="Settings"
              rightButton
              onPress={onClose}
            />
          </ButtonCluster>
        </ContentContainer>
      </Animated.View>
    </AnimatedGlassView>
  );
}

const styles = StyleSheet.create({
  glass: {
    flex: 1,
    // width: 400,
    height: CLOSED_HEIGHT,
    marginRight: 48,
    borderCurve: "continuous",
    borderRadius: CLOSED_HEIGHT / 2,
  },
  topBar: {
    width: "100%",
    height: CLOSED_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
