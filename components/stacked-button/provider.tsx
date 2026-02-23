import { createContext, use } from "react";
import { StyleProp, ViewStyle, PressableProps } from "react-native";
import {
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type SharedVal = {
  currentIndex: SharedValue<number>;
  itemStyles: StyleProp<ViewStyle>;
  itemProps: PressableProps;
  containerWidth: SharedValue<number>;
  itemCount: SharedValue<number>;
  gap: number;
  delayMs?: number;
};

const StackedButtonContext = createContext<SharedVal | undefined>(undefined);

export function Provider({
  children,
  currentIndex: _currentIndex,
  itemStyles,
  itemProps,
  gap = 0,
  delayMs = 3000,
}: {
  children: React.ReactNode;
} & Partial<Omit<SharedVal, "containerWidth" | "itemCount">>) {
  const __currentIndex = useSharedValue(0);
  const currentIndex = _currentIndex || __currentIndex;

  const containerWidth = useSharedValue(0);
  const itemCount = useSharedValue(0);

  useAnimatedReaction(
    () => currentIndex.value,
    (current, prev) => {
      if (current > 0 && !prev) {
        currentIndex.set(withDelay(delayMs, withTiming(0, { duration: 0 })));
      }
    },
  );

  return (
    <StackedButtonContext
      value={{
        currentIndex,
        itemStyles,
        itemProps: itemProps || {},
        containerWidth,
        itemCount,
        gap,
      }}
    >
      {children}
    </StackedButtonContext>
  );
}

export function useStackedButton(): SharedVal {
  const context = use(StackedButtonContext);
  if (!context) {
    throw new Error(
      "useStackedButton must be used within a StackedButtonProvider",
    );
  }
  return context;
}
