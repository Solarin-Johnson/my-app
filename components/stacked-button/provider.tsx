import { createContext, use, useEffect, useLayoutEffect } from "react";
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
  initialIndex?: number;
};

const StackedButtonContext = createContext<SharedVal | undefined>(undefined);

export function Provider({
  children,
  currentIndex: _currentIndex,
  itemStyles,
  itemProps,
  gap = 0,
  delayMs = 3000,
  initialIndex = 0,
}: {
  children: React.ReactNode;
  delayMs?: number;
} & Partial<Omit<SharedVal, "containerWidth" | "itemCount">>) {
  const __currentIndex = useSharedValue(initialIndex);
  const currentIndex = _currentIndex || __currentIndex;

  const containerWidth = useSharedValue(0);
  const itemCount = useSharedValue(0);

  useAnimatedReaction(
    () => currentIndex.value,
    (current, prev) => {
      if (!delayMs) return;
      //   console.log(current);

      if (current !== initialIndex && prev !== current) {
        currentIndex.set(
          withDelay(delayMs, withTiming(initialIndex, { duration: 0 })),
        );
      }
    },
  );

  useLayoutEffect(() => {
    currentIndex.set(initialIndex);
  }, []);

  return (
    <StackedButtonContext
      value={{
        currentIndex,
        itemStyles,
        itemProps: itemProps || {},
        containerWidth,
        itemCount,
        gap,
        initialIndex,
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
