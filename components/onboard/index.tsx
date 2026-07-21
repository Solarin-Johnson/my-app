import { JSX } from "react";
import { OnboardContextType, OnboardProvider } from "./provider";

type OnboardType = ((props: OnboardContextType) => JSX.Element) & {};

const Onboard = OnboardProvider as OnboardType;

export default Onboard;
