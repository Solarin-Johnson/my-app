import { fonts } from "./../node_modules/@react-navigation/native/src/theming/fonts";
import { Theme } from "@react-navigation/native";
import { Colors } from "./Colors";

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: "rgb(10, 132, 255)",
    border: "rgb(39, 39, 41)",
    notification: "rgb(255, 69, 58)",
    ...Colors.dark,
  },
  fonts,
};

export const LightTheme: Theme = {
  dark: false,
  colors: {
    primary: "rgb(0, 122, 255)",
    border: "rgb(216, 216, 216)",
    notification: "rgb(255, 59, 48)",
    ...Colors.light,
  },
  fonts,
};
