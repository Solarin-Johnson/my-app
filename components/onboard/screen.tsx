import { Image } from "expo-image";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenProps = React.PropsWithChildren;

const HEIGHT_RATIO = 0.5;

export default function Screen({ children }: ScreenProps) {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: top }]}>
      <View>
        {children}
        <Image
          source={require("@/assets/images/smartphone-mockup.png")}
          style={styles.frame}
          contentFit="contain"
          cachePolicy={"memory-disk"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    flex: HEIGHT_RATIO,
    overflow: "hidden",
    alignItems: "center",
  },
  frame: {
    alignSelf: "center",
    // backgroundColor: "red",
    aspectRatio: 1,
    height: "140%",
  },
});
