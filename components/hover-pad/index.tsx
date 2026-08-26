export type * from "./types";
export * from "./provider";

import { JSX, ReactNode } from "react";
import { ProviderType } from "./types";
import HoverPadProvider from "./provider";
import Item from "./item";
import Pad from "./pad";

type HoverPadType = ((props: ProviderType) => JSX.Element) & {
  Item: typeof Item;
  Pad: typeof Pad;
};

const HoverPad = HoverPadProvider as HoverPadType;
HoverPad.Item = Item;
HoverPad.Pad = Pad;

export default HoverPad;
