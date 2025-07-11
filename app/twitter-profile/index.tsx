import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  SharedValue,
  useAnimatedReaction,
  interpolate,
  Extrapolation,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import {
  ArrowLeft,
  Bell,
  LucideIcon,
  LucideProps,
  Search,
  Share,
} from "lucide-react-native";

const FULL_HEADER_HEIGHT = 160;
const COLLAPSED_HEADER_HEIGHT = 50;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export default function TwitterProfile() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <>
      <Header scrollY={scrollY} />
      <Animated.ScrollView
        style={styles.container}
        onScroll={scrollHandler}
        contentContainerStyle={{ paddingTop: FULL_HEADER_HEIGHT }}
      >
        <ThemedView
          style={{
            height: 1500,
          }}
        />
      </Animated.ScrollView>
    </>
  );
}

function Header({ scrollY }: { scrollY: SharedValue<number> }) {
  const { top } = useSafeAreaInsets();
  const intensity = useSharedValue<number | undefined>(0);

  useAnimatedReaction(
    () => scrollY.value,
    (value) => {
      intensity.value = interpolate(
        Math.abs(value),
        [0, FULL_HEADER_HEIGHT],
        [0, 32],
        Extrapolation.CLAMP
      );
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, FULL_HEADER_HEIGHT],
        [FULL_HEADER_HEIGHT, COLLAPSED_HEADER_HEIGHT + top],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          scale: interpolate(
            -scrollY.value,
            [0, FULL_HEADER_HEIGHT],
            [1, 1.2],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const headerImageAnimatedStyle = useAnimatedStyle(() => {
    return {};
  });

  return (
    <>
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: top,
          },
          animatedStyle,
        ]}
        pointerEvents={"box-none"}
      >
        <CoverImage intensity={intensity} style={headerImageAnimatedStyle} />
      </Animated.View>
      <View
        style={[styles.headerNav, { paddingTop: top }]}
        pointerEvents="box-none"
      >
        <Button icon={ArrowLeft} />
        <View style={styles.navCluster} pointerEvents="box-none">
          <Button icon={Bell} />
          <Button icon={Search} />
          <Button icon={Share} />
        </View>
      </View>
    </>
  );
}

const CoverImage = ({
  style,
  intensity,
}: {
  style?: object;
  intensity: SharedValue<number | undefined>;
}) => {
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          height: FULL_HEADER_HEIGHT,
          overflow: "hidden",
        },
        style,
      ]}
      pointerEvents="none"
    >
      <Image
        source={
          "https://pbs.twimg.com/profile_banners/1674810013007659014/1752253038/1500x500"
        }
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />
      <AnimatedBlurView
        intensity={intensity}
        style={StyleSheet.absoluteFillObject}
      />
    </Animated.View>
  );
};

const Button = ({
  onPress,
  icon: Icon,
  iconProps = {},
}: {
  onPress?: () => void;
  icon: LucideIcon;
  iconProps?: LucideProps;
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon size={21} color="white" strokeWidth={2.1} {...iconProps} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 1,
    overflow: "hidden",
  },
  button: {
    width: COLLAPSED_HEADER_HEIGHT - 10,
    aspectRatio: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerNav: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 2,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navCluster: {
    flexDirection: "row",
    gap: 16,
  },
});
