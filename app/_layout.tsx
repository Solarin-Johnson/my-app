import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Head from "expo-router/head";
import { Colors } from "@/constants/Colors";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
    InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Head>
        <meta name="color-scheme" content="light dark" />
      </Head>
      <SafeAreaProvider>
        <ThemeProvider
          value={{
            ...(colorScheme === "dark" ? DarkTheme : DefaultTheme),
            colors: {
              ...DefaultTheme.colors,
              background: Colors[colorScheme ?? "light"].background,
            },
          }}
        >
          <Stack
            initialRouteName="keyboard-ctrl"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="index" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </>
  );
}
