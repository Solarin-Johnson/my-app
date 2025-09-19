import {
  View,
  StyleSheet,
  GestureResponderEvent,
  Pressable,
} from "react-native";
import React, { ReactElement } from "react";
import { Image } from "expo-image";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { applySpring, CLOSED_HEIGHT } from "./config";
import { Ellipsis, X } from "lucide-react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import Entypo from "@expo/vector-icons/Entypo";
import { Button, ContextMenu, Host, Text as UIText } from "@expo/ui/swift-ui";

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
          <ThemedTextWrapper colorName="slackText">
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
      <ThemedText
        type="defaultSemiBold"
        style={styles.nameText}
        colorName="slackText"
      >
        {name}
      </ThemedText>
      <ThemedText
        style={styles.tabsText}
        colorName="slackText"
      >{`${tabs} tabs`}</ThemedText>
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
      <ThemedTextWrapper colorName="slackText">
        <Ellipsis size={21} />
      </ThemedTextWrapper>
    </AnimatedPressable>
  );
};

const ContentContainer = ({
  children,
  opened,
  modal,
}: {
  children: React.ReactNode;
} & ItemProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: applySpring(opened.value ? 1 : 0),
    };
  });

  if (!modal) return null;

  return (
    <Animated.ScrollView
      style={[styles.container, animatedStyle]}
      contentContainerStyle={styles.contentContainer}
    >
      {children}
    </Animated.ScrollView>
  );
};

const QuickActions = () => {
  return (
    <Animated.View style={styles.quickActions}>
      <QuickActionsItem
        icon={<AntDesign name="user-add" size={18} />}
        label="Add"
      />
      <QuickActionsItem
        icon={<Feather name="star" size={18} />}
        label="Move"
        menus={[
          { title: "Move To Starred", systemImage: "star" },
          {
            title: "Move to New Section",
            systemImage: "plus",
          },
        ]}
      />
      <QuickActionsItem
        icon={<Feather name="search" size={18} />}
        label="Search"
      />
    </Animated.View>
  );
};

const QuickActionsItem = ({
  icon,
  label,
  menus = [],
}: {
  icon: ReactElement<any>;
  label: string;
  menus?: Array<{
    title: string;
    disabled?: boolean;
    variant?: "default" | "bordered";
    onPress?: () => void;
    systemImage?: string;
  }>;
}) => {
  const text = useThemeColor("slackText");
  return (
    <Host style={styles.quickItemWrapper}>
      <ContextMenu>
        <ContextMenu.Items>
          {menus.map((menu, index) => (
            <Button
              key={index}
              disabled={menu.disabled}
              variant={menu.variant}
              onPress={menu.onPress}
              systemImage={
                typeof menu.systemImage === "string"
                  ? menu.systemImage
                  : undefined
              }
            >
              {menu.title}
            </Button>
          ))}
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <View style={[styles.quickItem, { borderColor: text + "16" }]}>
            <ThemedTextWrapper colorName="slackText">{icon}</ThemedTextWrapper>
            <ThemedText
              type="defaultSemiBold"
              style={{ fontSize: 13.5 }}
              colorName="slackText"
            >
              {label}
            </ThemedText>
          </View>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
};

const ButtonCluster = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.buttonCluster}>{children}</View>;
};

const BarButton = ({
  icon,
  label,
  active = false,
  onPress,
  rightButton = false,
}: {
  icon: ReactElement<any>;
  label: string;
  active?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  rightButton?: boolean;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedPressable
      style={[styles.button, active && styles.activeButton, animatedStyle]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 200 });
      }}
    >
      <View style={styles.buttonIcon}>
        <ThemedTextWrapper colorName="slackText">{icon}</ThemedTextWrapper>
      </View>
      <ThemedText
        colorName="slackText"
        style={[styles.label, active && styles.activeLabel]}
        type={active ? "default" : "regular"}
      >
        {label}
      </ThemedText>
      {rightButton && (
        <ThemedTextWrapper
          colorName="slackText"
          style={[styles.buttonIcon, { opacity: 0.8, width: "auto" }]}
        >
          <Entypo name="chevron-thin-right" size={20} />
        </ThemedTextWrapper>
      )}
    </AnimatedPressable>
  );
};

const ButtonSeperator = () => {
  return (
    <ThemedView
      colorName="text"
      style={{
        height: 1,
        opacity: 0.05,
        marginVertical: 4,
      }}
    />
  );
};

export {
  Dp,
  InfoBar,
  BarOptions,
  QuickActions,
  ButtonCluster,
  ContentContainer,
  BarButton,
  ButtonSeperator,
};

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
  quickActions: {
    flexDirection: "row",
    flex: 1,
    height: 40,
    paddingHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    gap: 10,
  },
  quickItem: {
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    borderCurve: "continuous",
  },
  quickItemWrapper: {
    flex: 1,
    height: "100%",
  },
  container: {
    flex: 1,
  },
  contentContainer: {},
  buttonCluster: {},
  button: {
    marginHorizontal: 6,
    padding: 12,
    flex: 1,
    borderRadius: 12,
    borderCurve: "continuous",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeButton: {
    backgroundColor: "#88888820",
  },
  label: {
    flex: 1,
    opacity: 0.8,
  },
  activeLabel: {
    opacity: 1,
  },
  buttonIcon: {
    width: 32,
    paddingLeft: 2,
  },
});
