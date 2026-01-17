import React, { memo } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  SharedValue,
  interpolate,
  Extrapolation,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import {
  ArrowLeft,
  Bell,
  LucideIcon,
  LucideProps,
  Search,
  Share,
} from "lucide-react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

const isWeb = Platform.OS === "web";

const FULL_HEADER_HEIGHT = 160;
const COLLAPSED_HEADER_HEIGHT = isWeb ? 54 : 50;
const PP_SIZE = isWeb ? 120 : 80;

const DATA = {
  name: "Solarin",
  username: "S0LARIN",
  profileImage:
    "https://pbs.twimg.com/profile_images/1840756205716635648/3HOkBe_W_400x400.jpg",
  coverImage:
    "https://pbs.twimg.com/profile_banners/1674810013007659014/1752253038/1500x500",
  postCount: "491",
  bio: "18, I write design code —Web, Mobile",
  link: "github.com/Solarin-Johnson",
  followers: "1.4K",
  following: "222",
};

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
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            height: 1500,
          }}
        >
          <ProfileMain scrollY={scrollY} />
        </View>
      </Animated.ScrollView>
    </>
  );
}

function Header({ scrollY }: { scrollY: SharedValue<number> }) {
  const { top } = useSafeAreaInsets();
  const swapDistance = FULL_HEADER_HEIGHT - top - COLLAPSED_HEADER_HEIGHT;

  const intensity = useDerivedValue<number | undefined>(() =>
    interpolate(
      Math.abs(scrollY.value),
      [0, FULL_HEADER_HEIGHT],
      [0, 32],
      Extrapolation.CLAMP,
    ),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, swapDistance],
      [FULL_HEADER_HEIGHT, COLLAPSED_HEADER_HEIGHT + top],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(
          -scrollY.value,
          [0, FULL_HEADER_HEIGHT],
          [1, 1.3],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const fixedHeaderImgStyle = useAnimatedStyle(() => ({
    opacity: scrollY.value >= swapDistance ? 1 : 0,
  }));

  const underlayHeaderImgStyle = useAnimatedStyle(() => ({
    opacity: scrollY.value < swapDistance ? 1 : 0,
  }));

  const headerStyle = [styles.header, { paddingTop: top }, animatedStyle];

  return (
    <>
      <Animated.View style={headerStyle} pointerEvents="box-none">
        <CoverImage intensity={intensity} style={underlayHeaderImgStyle} />
      </Animated.View>
      <Animated.View
        style={[...headerStyle, { zIndex: 2 }]}
        pointerEvents="box-none"
      >
        <CoverImage intensity={intensity} style={fixedHeaderImgStyle} />
      </Animated.View>
      <View
        style={[
          styles.headerNav,
          { paddingTop: top * 0.85, height: COLLAPSED_HEADER_HEIGHT + top },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.navCluster} pointerEvents="box-none">
          <Button icon={ArrowLeft} />
          <HeaderTitle scrollY={scrollY} />
        </View>
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
}) => (
  <Animated.View
    style={[
      StyleSheet.absoluteFillObject,
      { height: FULL_HEADER_HEIGHT, overflow: "hidden" },
      style,
    ]}
    pointerEvents="none"
  >
    <Image
      source={DATA.coverImage}
      style={StyleSheet.absoluteFillObject}
      contentFit="cover"
    />
    <AnimatedBlurView
      intensity={intensity}
      style={StyleSheet.absoluteFillObject}
    />
  </Animated.View>
);

const Button = memo(
  ({
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
        <Icon size={20} color="white" strokeWidth={2.1} {...iconProps} />
      </TouchableOpacity>
    );
  },
);

const HeaderTitle = ({ scrollY }: { scrollY: SharedValue<number> }) => {
  const { top } = useSafeAreaInsets();

  const start =
    FULL_HEADER_HEIGHT - top - COLLAPSED_HEADER_HEIGHT + PP_SIZE / 1.5;

  const end = FULL_HEADER_HEIGHT - top + PP_SIZE;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [start, end],
          [COLLAPSED_HEADER_HEIGHT, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText
        type="semiBold"
        style={{
          fontSize: 18,
          color: "white",
        }}
      >
        {DATA.name}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: 13,
          color: "#fff",
          opacity: 0.9,
        }}
      >
        {`${DATA.postCount} posts`}
      </ThemedText>
    </Animated.View>
  );
};

const ProfileMain = ({ scrollY }: { scrollY: SharedValue<number> }) => {
  const bg = useThemeColor("background");
  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          scrollY.value,
          [0, COLLAPSED_HEADER_HEIGHT + (isWeb ? PP_SIZE / 3 : 0)],
          [1, 0.6],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));
  return (
    <View style={styles.profileMain}>
      <Animated.View
        style={[
          styles.ppCover,
          {
            borderColor: bg,
          },
          imageAnimatedStyle,
        ]}
      >
        <Image source={DATA.profileImage} style={styles.profileImage} />
      </Animated.View>
      <ThemedText type="bold" style={styles.name}>
        {DATA.name}
      </ThemedText>
      <TouchableOpacity style={styles.profileBtn} activeOpacity={0.7}>
        <ThemedText type="semiBold" style={{ fontSize: 16 }}>
          Edit Profile
        </ThemedText>
      </TouchableOpacity>
      <ThemedText style={styles.uname}>{`@${DATA.username}`}</ThemedText>
      <ThemedText style={styles.bio}>{DATA.bio}</ThemedText>
      <View style={[styles.navCluster, styles.followContainer]}>
        <ThemedText type="semiBold">
          {DATA.following}
          <ThemedText style={styles.followLabel}>{" Following"}</ThemedText>
        </ThemedText>
        <ThemedText type="semiBold">
          {DATA.followers}
          <ThemedText style={styles.followLabel}>{" Followers"}</ThemedText>
        </ThemedText>
      </View>
    </View>
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
    overflow: "hidden",
  },
  button: {
    width: COLLAPSED_HEADER_HEIGHT - 12,
    aspectRatio: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
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
    overflow: "hidden",
  },
  navCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  profileMain: {
    paddingHorizontal: 16,
    zIndex: 10,
  },
  name: {
    fontSize: 24,
    lineHeight: 32,
  },
  uname: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.65,
  },
  ppCover: {
    borderRadius: "50%",
    overflow: "hidden",
    transformOrigin: `bottom ${isWeb ? "left" : "center"}`,
    width: PP_SIZE,
    aspectRatio: 1,
    alignItems: "center",
    marginTop: -PP_SIZE / 2.5,
    marginBottom: PP_SIZE * 0.05,
    borderWidth: 4,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    marginBottom: 8,
  },
  profileBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 0.8,
    borderColor: "#A0A0A060",
    borderRadius: 30,
    borderCurve: "continuous",
    alignSelf: "flex-end",
    position: "absolute",
    top: PP_SIZE / 5,
    right: 16,
    zIndex: 1,
  },
  bio: {
    fontSize: 15,
    paddingVertical: 10,
  },
  followContainer: {
    paddingVertical: 4,
  },
  followLabel: {
    color: "gray",
    fontSize: 15,
  },
});
