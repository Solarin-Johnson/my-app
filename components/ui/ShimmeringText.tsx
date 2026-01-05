import {
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, {
  measure,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "../ThemedText";
import { scheduleOnUI } from "react-native-worklets";
import { useEffect } from "react";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedThemedText = Animated.createAnimatedComponent(ThemedText);

export type ShimmeringTextProps = {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  speed?: number;
  size?: number;
  layerStyle?: StyleProp<ViewStyle>;
  color?: string;
  rtl?: boolean;
  start?: SharedValue<boolean>;
};

export default function ShimmeringText({
  text,
  textStyle,
  style,
  speed = 3000,
  size = 60,
  layerStyle,
  color = "#ffffff90",
  rtl = false,
  start,
}: ShimmeringTextProps) {
  const { width: windowWidth } = useWindowDimensions();
  const textRef = useAnimatedRef();
  const dimensions = useSharedValue<{ width: number; x: number }>({
    width: 0,
    x: 0,
  });

  useEffect(() => {
    scheduleOnUI(() => {
      const measurement = measure(textRef);
      if (measurement === null) {
        return;
      }
      const { width, x } = measurement;
      dimensions.value = { width, x };
    });
  }, [windowWidth]);

  const translateX = useDerivedValue(() => {
    const { width, x } = dimensions.value;
    if (start?.value) {
      return withRepeat(
        withSequence(
          withTiming(width + x, { duration: speed }),
          withTiming(-size, { duration: 0 })
        ),
        -1,
        true
      );
    }
    return 0;
  });

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      left: translateX.value,
      width: size,
    };
  });

  return (
    <MaskedView
      style={[
        {
          width: "100%",
          height: 50,
        },
        style,
      ]}
      maskElement={
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <AnimatedThemedText
            ref={textRef}
            style={[
              {
                fontSize: 30,
                fontWeight: "500",
              },
              textStyle,
              {
                color: "black",
              },
            ]}
          >
            {text}
          </AnimatedThemedText>
        </View>
      }
    >
      <View
        style={[
          {
            backgroundColor: color,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            transform: [
              {
                rotate: `${rtl ? 180 : 0}deg`,
              },
            ],
          },
          layerStyle,
        ]}
      >
        <AnimatedLinearGradient
          colors={["#ffffff00", "#ffffff", "#ffffff00"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.slider, animatedSliderStyle]}
        />
      </View>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  slider: {
    position: "absolute",
    height: "100%",
  },
});
