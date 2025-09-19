import { withSpring } from "react-native-reanimated";

const PADDING = 8;
const FULL_HEIGHT = 350;
const CLOSED_HEIGHT = 45;
const ANIMATION_DELAY = 230;
const OPENED_PAD = 4;

const DATA = {
  name: "Solarin Johnson",
  tabs: 3,
  bannerText:
    "This is your space. Draft messages, list your to-dos, or keep links and files handy. You can also talk to yourself here, but please bear in mind you'll have to supply both sides of the conversation.",
};

const SPRING_CONFIG = {
  stiffness: 300,
  damping: 30,
  mass: 1,
  overshootClamping: true,
};

const applySpring = (value: number) => {
  "worklet";
  return withSpring(value, SPRING_CONFIG);
};

export {
  PADDING,
  FULL_HEIGHT,
  CLOSED_HEIGHT,
  ANIMATION_DELAY,
  DATA,
  SPRING_CONFIG,
  OPENED_PAD,
  applySpring,
};
