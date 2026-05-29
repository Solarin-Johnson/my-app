import { Theme } from "expo-router/react-navigation";
import { Colors } from "./Colors";

const fonts = {
  regular: { fontFamily: "InterRegular", fontWeight: "400" as const },
  medium: { fontFamily: "InterMedium", fontWeight: "500" as const },
  semiBold: { fontFamily: "InterSemiBold", fontWeight: "600" as const },
  bold: { fontFamily: "InterBold", fontWeight: "700" as const },
  italic: { fontFamily: "LoraMediumItalic", fontWeight: "400" as const },
  heavy: { fontFamily: "InterBold", fontWeight: "800" as const },
};

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
