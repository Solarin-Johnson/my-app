import { JSX } from "react";
import { ChangeMoodProvider, ChangeMoodProviderProps } from "./provider";
import Container from "./container";
import Item from "./item";
import Title from "./title";

type MoodChangeType = ((props: ChangeMoodProviderProps) => JSX.Element) & {
  Container: typeof Container;
  Item: typeof Item;
  Title: typeof Title;
};

const MoodChange = ChangeMoodProvider as MoodChangeType;
MoodChange.Container = Container;
MoodChange.Item = Item;
MoodChange.Title = Title;

export default MoodChange;
