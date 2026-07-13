import { View, Text, StyleSheet } from "react-native";
import { UIConditionalRender } from "../UIConditionalRender";
import {
  SPRING_CONFIG,
  SPRING_CONFIG_BOUNCE,
  SPRING_CONFIG_FAST,
  SPRING_CONFIG_SLOW,
  useChangeMood,
} from "./provider";
import Animated, {
  cancelAnimation,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { tintHex } from "@/functions";
import { ThemedText } from "../ThemedText";

type TitleProps = {
  titles: string[];
  colors: string[];
};

// const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const IDLE_DURATION = 1500;
const WELCOME_IDLE_DURATION = 5000;

const applySpring = (value: number) => {
  "worklet";
  return withSpring(value, SPRING_CONFIG_SLOW);
};

export default function Title({ titles, colors }: TitleProps) {
  const { currentIndex } = useChangeMood();
  const timer = useSharedValue(0);
  const hide = useSharedValue(true);

  const index = useDerivedValue(() => {
    return hide.value ? 0 : currentIndex.value;
  });

  useAnimatedReaction(
    () => currentIndex.value,
    (index) => {
      cancelAnimation(timer);
      hide.value = index === 0;
      timer.value = 0;
      timer.value = withTiming(1, { duration: IDLE_DURATION }, (finished) => {
        if (finished) hide.value = true;
      });
    },
  );

  //   const blurAnimatedProp = useAnimatedProps(() => {
  //     return {
  //       intensity: applySpring(hide.value ? 10 : 0),
  //     };
  //   });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: applySpring(hide.value ? 0.75 : 1) }],
    };
  });

  //   const blurAnimatedStyle = useAnimatedStyle(() => {
  //     return {
  //       opacity: applySpring(hide.value ? 0 : 1),
  //     };
  //   });

  const sharedAnimationConfig = useDerivedValue(() => {
    return hide.value ? SPRING_CONFIG_SLOW : SPRING_CONFIG_BOUNCE;
  });

  return (
    <>
      <View style={styles.container}>
        <Animated.View style={animatedStyle}>
          <UIConditionalRender
            currentIndex={index}
            style={styles.wrapper}
            animationType="spring"
            sharedAnimationConfig={sharedAnimationConfig}
            elements={titles.map((title, index) => (
              <Text
                key={index}
                style={[styles.text, { color: tintHex(colors[index], 0.5) }]}
              >
                {title}
              </Text>
            ))}
          />
        </Animated.View>
        {/* <AnimatedBlurView
        style={[StyleSheet.absoluteFill, styles.blur, blurAnimatedStyle]}
        tint="regular"
        animatedProps={blurAnimatedProp}
        /> */}
      </View>
      <Description />
    </>
  );
}

const Description = () => {
  const { currentIndex } = useChangeMood();
  const timer = useSharedValue(0);
  const show = useSharedValue(true);

  useAnimatedReaction(
    () => currentIndex.value,
    (index, previousIndex) => {
      cancelAnimation(timer);

      if (index === 0 && (previousIndex == null || previousIndex === 0)) {
        show.value = true;
        return;
      }

      show.value = false;

      if (index === 0) {
        timer.value = 0;
        timer.value = withTiming(
          1,
          { duration: WELCOME_IDLE_DURATION },
          (finished) => {
            if (finished) show.value = true;
          },
        );
      }
    },
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(show.value ? 1 : 0.75, SPRING_CONFIG_SLOW) },
      ],
      opacity: withSpring(show.value ? 1 : 0, SPRING_CONFIG_FAST),
    };
  });

  return (
    <Animated.View style={[styles.descContainer, animatedStyle]}>
      <ThemedText style={styles.descText} colorName="white">
        How are you feeeling?
      </ThemedText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 36,
    width: "100%",
    zIndex: -1,
  },
  wrapper: {
    alignItems: "center",
  },
  text: {
    fontFamily: "ui-rounded",
    fontSize: 21,
    fontWeight: "500",
  },
  blur: {
    zIndex: 0,
    left: 54,
    right: 54,
  },
  descContainer: {
    marginBottom: 180,
    position: "absolute",
    // backgroundColor: "red",
    width: "100%",
    alignItems: "center",
  },
  descText: {
    fontSize: 21,
    letterSpacing: -0.2,
    opacity: 0.75,
    fontFamily: "ui-rounded",
    fontWeight: "400",
  },
});
