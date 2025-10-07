import { createContext, use } from "react";
import { StyleProp, TextInputProps, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";

type SharedVal = {
  currentIndex: SharedValue<number>;
  itemStyles?: StyleProp<ViewStyle>;
  itemProps?: TextInputProps;
  maxIndex?: number;
  minIndex?: number;
};

const StackedInputContext = createContext<SharedVal | undefined>(undefined);

export function Provider({
  children,
  currentIndex,
  itemStyles,
  itemProps,
  maxIndex,
  minIndex,
}: {
  children: React.ReactNode;
} & SharedVal) {
  return (
    <StackedInputContext
      value={{ currentIndex, itemStyles, itemProps, maxIndex, minIndex }}
    >
      {children}
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
