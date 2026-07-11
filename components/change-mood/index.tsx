import { JSX } from "react";
import { ChangeMoodProvider, ChangeMoodProviderProps } from "./provider";
import Container from "./container";
import Item from "./item";

type MoodChangeType = ((props: ChangeMoodProviderProps) => JSX.Element) & {
  Container: typeof Container;
  Item: typeof Item;
};

const MoodChange = ChangeMoodProvider as MoodChangeType;
MoodChange.Container = Container;
MoodChange.Item = Item;

export default MoodChange;
