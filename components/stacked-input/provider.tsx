import { createContext, use } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  useSharedValue,
  SharedValue,
  useDerivedValue,
} from "react-native-reanimated";

type SharedVal = {
  currentIndex: SharedValue<number>;
};

const StackedInputContext = createContext<SharedVal | undefined>(undefined);

export function Provider({
  children,
  style,
  currentIndex,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  currentIndex: SharedValue<number>;
}) {
  return (
    <StackedInputContext value={{ currentIndex }}>
      <View style={[styles.container, style]}>{children}</View>
    </StackedInputContext>
  );
}

export function useStackedInput(): SharedVal {
  const context = use(StackedInputContext);
  if (!context) {
    throw new Error(
      "useStackedInput must be used within a StackedInputProvider"
    );
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    // backgroundColor: "red",
  },
});
