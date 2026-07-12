import { View, Text, StyleSheet } from "react-native";
import { UIConditionalRender } from "../UIConditionalRender";
import { SPRING_CONFIG_BOUNCE, useChangeMood } from "./provider";
import { useDerivedValue } from "react-native-reanimated";
import { tintHex } from "@/functions";

type TitleProps = {
  titles: string[];
  colors: string[];
};

export default function Title({ titles, colors }: TitleProps) {
  const { currentIndex } = useChangeMood();

  const index = useDerivedValue(() => {
    return currentIndex.value - 1;
  });
  return (
    <View style={styles.container}>
      <UIConditionalRender
        currentIndex={index}
        style={styles.wrapper}
        animationType="spring"
        animationConfig={SPRING_CONFIG_BOUNCE}
        elements={titles.map((title, index) => (
          <Text
            key={index}
            style={[styles.text, { color: tintHex(colors[index], 0.5) }]}
          >
            {title}
          </Text>
        ))}
      />
    </View>
  );
}

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
    fontSize: 24,
    fontWeight: "500",
  },
});
