/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const globalColors = {
  systemBlue: "#2D6AF6",
};

export const Colors = {
  light: {
    waBg: "#F4F4F4",
    text: "#181818",
    background: "#F5F5F7",
    barColor: "#FFFFFF",
    waCard: "#FFFFFF",
    card: "#F5F5F7",
    tint: tintColorLight,
    untitledBg: "#FFFFFF",
    untitledGradient1: "#D55FDC",
    untitledGradient2: "#F5C1DB",
    untitledBarBg: "#222222",
    slackBg: "#FFFFFF",
    slackText: "#1C1C1C",
    safariBg: "#F2F2F6",
    captchaBg: "#FFFFFF",
    captchaCardBg: "#F7F7F7",
    captchaCheckboxBg: "#272727",
    captchaCheckboxInitialBg: "#FFFFFF",
    popUpCardBg: "#FFFFFF",
    ...globalColors,
  },
  dark: {
    waBg: "#000000",
    text: "#F5F5F7",
    background: "#121212",
    card: "#121212",
    barColor: "#1A1A1A",
    waCard: "#171718",
    tint: tintColorDark,
    untitledBg: "#191918",
    untitledGradient1: "#D55FDC",
    untitledGradient2: "#F5C1DB",
    untitledBarBg: "#323232",
    slackBg: "#1B1D21",
    slackText: "#D2D2D4",
    safariBg: "#1C1C1E",
    captchaBg: "#0E0E0E",
    captchaCardBg: "#181818",
    captchaCheckboxBg: "#343434",
    captchaCheckboxInitialBg: "#656565",
    popUpCardBg: "#1A1A1A",
    ...globalColors,
  },
};
