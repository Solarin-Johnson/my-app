import { StyleSheet, View } from "react-native";
import { EaseView } from "react-native-ease";

const SIZE = 50;
const LEVELS = 4;
const COLOR = "#75FB4C";
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
};

export default function OnlinePulse({
  size = SIZE,
  levels = LEVELS,
  color = COLOR,
  stepTime = STEP_TIME,
  scale = SCALE,
  thumbColor = color,
  disableAnimation = false,
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
                experimental_backgroundImage: `radial-gradient(circle at center, transparent 30%, ${color} 20%)`,
              },
            ]}
            initialAnimate={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: scale, opacity: 0 }}
            transition={{
              type: "timing",
              delay: i * stepTime,
              duration: levels * stepTime,
              easing: "easeOut",
              loop: "repeat",
            }}
          />
        ))}
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
