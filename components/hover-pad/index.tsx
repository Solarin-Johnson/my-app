export type * from "./types";

import { JSX, ReactNode } from "react";
import { ProviderType } from "./types";
import HoverPadProvider from "./provider";

type HoverPadType = ((props: ProviderType) => JSX.Element) & {};

const HoverPad = HoverPadProvider as HoverPadType;

export default HoverPad;
