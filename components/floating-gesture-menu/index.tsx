import { JSX, ReactNode } from "react";
import FloatingMenuProvider, { ProviderType } from "./provider";
import Container from "./container";
import Trigger from "./trigger";
import Item from "./item";
import Overlay from "./overlay";
import { Button, ButtonContainer } from "./button";

type FloatingMenuType = ((props: ProviderType) => JSX.Element) & {
  Container: typeof Container;
  Trigger: typeof Trigger;
  Item: typeof Item;
  Overlay: typeof Overlay;
  ButtonContainer: typeof ButtonContainer;
  Button: typeof Button;
  displayName?: string;
};

const FloatingMenu = FloatingMenuProvider as FloatingMenuType;
FloatingMenu.Container = Container;
FloatingMenu.Trigger = Trigger;
FloatingMenu.Item = Item;
FloatingMenu.Overlay = Overlay;
FloatingMenu.Button = Button;
FloatingMenu.ButtonContainer = ButtonContainer;

FloatingMenu.displayName = "FloatingMenu";

export default FloatingMenu;
