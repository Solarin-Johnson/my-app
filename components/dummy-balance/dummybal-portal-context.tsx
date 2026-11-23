import { createContext, useContext, type PropsWithChildren } from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";

type PortalCoordinates = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DummyBalPortalContextValue = {
  cord: SharedValue<PortalCoordinates>;
  rotateProgress: SharedValue<number>;
};

export const DummyBalPortalContext =
  createContext<DummyBalPortalContextValue | null>(null);

export function DummyBalPortalProvider({ children }: PropsWithChildren) {
  const cord = useSharedValue<PortalCoordinates>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const rotateProgress = useSharedValue(0);

  return (
    <DummyBalPortalContext.Provider value={{ cord, rotateProgress }}>
      {children}
    </DummyBalPortalContext.Provider>
  );
}

export function useDummyBalPortalContext() {
  const context = useContext(DummyBalPortalContext);

  if (!context) {
    throw new Error(
      "useDummyBalPortalContext must be used within a DummyBalPortalProvider",
    );
  }

  return context;
}
