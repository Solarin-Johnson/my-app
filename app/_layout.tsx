import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Head from "expo-router/head";
import { Drawer } from "expo-router/drawer";
import { useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, LightTheme } from "@/constants/Theme";
import DrawerContent from "@/components/DrawerContent";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  const [loaded] = useFonts({
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
    InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <Head>
        <meta name="color-scheme" content="light dark" />
      </Head> */}
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : LightTheme}>
          <Drawer
            screenOptions={{
              headerShown: false,
              drawerType: "slide",
              swipeEdgeWidth: width,
              swipeMinDistance: width * 0.33,
            }}
            drawerContent={(props) => <DrawerContent {...props} />}
            initialRouteName="keyboard-ctrl"
          >
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: "Home",
              }}
            />
            <Drawer.Screen
              name="keyboard-ctrl"
              options={{
                drawerLabel: "Keyboard Controller",
              }}
            />
          </Drawer>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
