import Container from "./container";
import Item, { SPRING_CONFIG } from "./item";
import { Provider } from "./provider";

export const StackedButton = {
  Provider,
  Container,
  Item,
  springConfig: SPRING_CONFIG,
};

export type StackedButtonItemProps = React.ComponentProps<typeof Item>;
