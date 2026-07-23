import { JSX } from "react";
import { OnboardProvider, OnboardProviderProps } from "./provider";
import Screen from "./screen";
import Screenshot from "./screenshot";

type OnboardType = ((props: OnboardProviderProps) => JSX.Element) & {
  Screen: typeof Screen;
  Screenshot: typeof Screenshot;
};

const Onboard = OnboardProvider as OnboardType;
Onboard.Screen = Screen;
Onboard.Screenshot = Screenshot;

export default Onboard;
