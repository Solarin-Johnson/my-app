import { StyleSheet, View } from "react-native";
import { EaseView, EasingType } from "react-native-ease";

const SIZE = 50;
const LEVELS = 4;
const COLOR = "#76FB4D";
const STEP_TIME = 800;
const SCALE = 3;

type OnlinePulseProps = {
  size?: number;
  levels?: number;
  color?: string;
  stepTime?: number;
  scale?: number;
  thumbColor?: string;
  disableAnimation?: boolean;
  easing?: EasingType;
  children?: React.ReactNode;
};

export default function OnlinePulse({
  size = SIZE,
  levels = LEVELS,
  color = COLOR,
  stepTime = STEP_TIME,
  scale = SCALE,
  thumbColor = color,
  disableAnimation = false,
  easing = "easeOut",
  children,
}: OnlinePulseProps) {
  return (
    <View
      style={[styles.container, { width: size, backgroundColor: thumbColor }]}
    >
      {!disableAnimation &&
        [...Array(levels)].map((_, i) => (
          <EaseView
            key={i}
            style={[
              styles.item,
              {
                experimental_backgroundImage: `radial-gradient(circle at center, transparent 0%, ${color} 20%)`,
              },
            ]}
            initialAnimate={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: scale, opacity: 0 }}
            transition={{
              type: "timing",
              delay: i * stepTime,
              duration: levels * stepTime,
              easing,
              loop: "repeat",
            }}
          />
        ))}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0.5px 0.5px 3px #00000020",
  },
  item: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: "50%",
    position: "absolute",
    zIndex: -1,
  },
});
