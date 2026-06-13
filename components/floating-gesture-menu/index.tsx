import { JSX, ReactNode } from "react";
import FloatingMenuProvider, { ProviderType } from "./provider";
import Container from "./container";
import Trigger from "./trigger";
import Item from "./item";

type FloatingMenuType = ((props: ProviderType) => JSX.Element) & {
  Container: typeof Container;
  Trigger: typeof Trigger;
  Item: typeof Item;
};

const FloatingMenu = FloatingMenuProvider as FloatingMenuType;
FloatingMenu.Container = Container;
FloatingMenu.Trigger = Trigger;
FloatingMenu.Item = Item;

export default FloatingMenu;
