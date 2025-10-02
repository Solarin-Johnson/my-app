import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Head from "expo-router/head";
import { Drawer } from "expo-router/drawer";
import { Platform, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, LightTheme } from "@/constants/Theme";
import DrawerContent from "@/components/DrawerContent";
import { useThemeColor } from "@/hooks/useThemeColor";
import { KeyboardProvider } from "react-native-keyboard-controller";

const isWeb = Platform.OS === "web";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    InterRegular: require("../assets/fonts/Inter-Regular.ttf"),
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
    InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
    InterBold: require("../assets/fonts/Inter-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {isWeb && (
        <Head>
          <meta name="color-scheme" content="light dark" />
        </Head>
      )}
      <KeyboardProvider>
        <SafeAreaProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : LightTheme}
          >
            <NavigationDrawer />
            <StatusBar style="auto" />
          </ThemeProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export function NavigationDrawer() {
  const { width } = useWindowDimensions();
  const text = useThemeColor("text");
  const theme = useColorScheme();
  const isLight = theme === "light";

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        swipeEdgeWidth: width,
        swipeMinDistance: width * 0.03,
        drawerStyle: {
          width: width * 0.85,
        },
        drawerLabelStyle: {
          fontFamily: "InterMedium",
          height: 24,
        },
        drawerItemStyle: {
          borderRadius: 12,
          borderCurve: "continuous",
        },
        drawerActiveTintColor: text,
        drawerActiveBackgroundColor: `${text}10`,
        drawerInactiveTintColor: text + "90",
        ...(isLight && { overlayColor: "#00000030" }),
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="index"
        initialParams={{ userId: "default-user", showBio: false }}
        options={{
          drawerLabel: "Home",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="keyboard-ctrl"
        options={{
          drawerLabel: "Keyboard Controller",
        }}
      />
      <Drawer.Screen
        name="gesture-nav"
        options={{
          drawerLabel: "Gesture Navigation",
        }}
      />
      <Drawer.Screen
        name="twitter-profile"
        options={{
          drawerLabel: "Twitter Profile",
        }}
      />
      <Drawer.Screen
        name="threads-pull-refresh"
        options={{
          drawerLabel: "Threads Pull Refresh",
        }}
      />
      <Drawer.Screen
        name="grok-sidebar"
        options={{
          drawerLabel: "Grok Sidebar",
          drawerType: "front",
          swipeMinDistance: width * 0.25,
          drawerStyle: {
            width: width,
            backgroundColor: "transparent",
          },
          overlayColor: "transparent",
        }}
        initialParams={{ noPreview: true }}
      />
      <Drawer.Screen
        name="gesture-menu"
        options={{
          drawerLabel: "Gesture Menu",
        }}
      />
      <Drawer.Screen
        name="wa-status"
        options={{
          drawerLabel: "WhatsApp Status",
        }}
      />
      <Drawer.Screen
        name="untitled"
        options={{
          drawerLabel: "Screen Transitions",
          swipeEdgeWidth: 10,
        }}
        initialParams={{ noPreview: true }}
      />
      <Drawer.Screen
        name="slack-liquid-glass"
        options={{
          drawerLabel: "Slack Liquid Glass",
        }}
      />
      <Drawer.Screen
        name="safari-bar"
        options={{
          drawerLabel: "Safari Bar",
          headerTransparent: true,
        }}
      />
    </Drawer>
  );
}
