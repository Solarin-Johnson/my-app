import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { SHARED_DATA } from "@/constants";
import { Image } from "expo-image";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function Index() {
  const colors = ["red", "blue", "green", "yellow"];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <Card />
      </SafeAreaView>
    </ThemedView>
  );
}

const Card = () => {
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const text = useThemeColor("text");
  const CARD_WIDTH = width - 44;
  const IMAGES = SHARED_DATA.apps.map((app) => app.logo);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: text + "12",
        },
      ]}
    >
      <ThemedText style={styles.text}>{SHARED_DATA.text}</ThemedText>
      <PeekCard
        images={IMAGES}
        text={`${SHARED_DATA.apps.length} Music Apps`}
      />
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate={"fast"}
        onScroll={scrollHandler}
      >
        {SHARED_DATA.apps.map((app) => (
          <View style={{ width: CARD_WIDTH, margin: 6 }} key={app.name}>
            <CardItem app={app} />
          </View>
        ))}
      </Animated.ScrollView>
      <PaginationDots scrollX={scrollX} cardWidth={CARD_WIDTH} />
    </View>
  );
};

const CardItem = ({ app }: { app: (typeof SHARED_DATA.apps)[0] }) => {
  const text = useThemeColor("text");
  return (
    <ThemedView style={styles.cardItem}>
      <View style={styles.tags}>
        {app.platforms.map((platform) => (
          <View
            key={platform}
            style={[
              styles.tagItem,
              {
                backgroundColor: text + "12",
              },
            ]}
          >
            <ThemedText style={{ fontSize: 12 }} type="defaultSemiBold">
              {platform}
            </ThemedText>
          </View>
        ))}
      </View>
      <View
        style={[
          styles.cardHeader,
          {
            borderColor: text + "30",
          },
        ]}
      >
        <Animated.View>
          <Image source={app.logo} style={styles.logo} contentFit="cover" />
        </Animated.View>
        <ThemedText style={styles.cardTitle} type="defaultSemiBold">
          {app.name}
        </ThemedText>
      </View>
      <ThemedText style={styles.cardDescription}>{app.description}</ThemedText>
    </ThemedView>
  );
};

const PaginationDots = ({
  scrollX,
  cardWidth,
}: {
  scrollX: SharedValue<number>;
  cardWidth: number;
}) => {
  const totalDots = SHARED_DATA.apps.length;

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        justifyContent: "center",
        marginTop: 12,
        marginBottom: 24,
      }}
    >
      {Array.from({ length: totalDots }).map((_, index) => (
        <PaginationDot
          key={index}
          index={index}
          scrollX={scrollX}
          cardWidth={cardWidth}
        />
      ))}
    </View>
  );
};

const PaginationDot = ({
  index,
  scrollX,
  cardWidth,
}: {
  index: number;
  scrollX: SharedValue<number>;
  cardWidth: number;
}) => {
  const text = useThemeColor("text");

  const inputRange = [
    (index - 1) * (cardWidth + 12),
    index * (cardWidth + 12),
    (index + 1) * (cardWidth + 12),
  ];

  const dotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.2, 1, 0.2],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: text,
        },
        dotStyle,
      ]}
    />
  );
};

const PeekCard = ({ images, text }: { images: string[]; text: string }) => {
  const color = useThemeColor("background");
  return (
    <ThemedView style={styles.peekCard}>
      <View style={styles.peekImages}>
        {images.map((image, index) => (
          <Link href="/shared-option/expanded" key={index}>
            <AnimatedImage
              sharedTransitionTag={`peek-image-${index}`}
              source={image}
              style={styles.peekImage}
              contentFit="cover"
              cachePolicy={"memory-disk"}
            />
          </Link>
        ))}
      </View>
      <ThemedText style={styles.peekText}>{text}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingVertical: 32,
  },
  card: {
    width: "100%",
    borderRadius: 20,
    borderCurve: "continuous",
  },
  text: {
    fontSize: 15,
    padding: 12,
    lineHeight: 20,
  },
  cardItem: {
    padding: 14,
    borderRadius: 20,
    borderCurve: "continuous",
    gap: 12,
    marginTop: 12,
  },
  cardTitle: {
    fontSize: 24,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  tags: {
    flexDirection: "row",
  },
  tagItem: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  peekCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 7,
    paddingRight: 12,
    alignSelf: "flex-start",
    marginHorizontal: 12,
    marginVertical: 2,
    borderRadius: 40,
  },
  peekText: {
    fontSize: 14,
    opacity: 0.6,
    letterSpacing: -0.1,
  },
  peekImages: {
    flexDirection: "row",
    alignItems: "center",
  },
  peekImage: {
    width: 23,
    height: 23,
    borderRadius: 12,
    // borderWidth: 1.5,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -1.5,
  },
});
