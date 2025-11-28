import Head from "expo-router/head";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

export default function HeadComponent() {
  if (!isWeb) return null;

  return (
    <Head>
      <title>My App</title>
      <meta
        name="description"
        content="My personal Expo playground for React Native animations and UI experiments"
      />
      <meta name="color-scheme" content="light dark" />
      <meta name="author" content="Solarin Johnson" />

      {/* Open Graph / Facebook */}
      <meta
        name="og:image"
        content="https://raw.githubusercontent.com/Solarin-Johnson/my-app/refs/heads/main/assets/images/twitter-cover.png"
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="675" />
      <meta property="og:title" content="My App" />
      <meta
        property="og:description"
        content="My personal Expo playground for React Native animations and UI experiments"
      />
      <meta property="og:url" content="https://solarin.expo.app" />

      {/* Twitter */}
      <meta
        name="twitter:image"
        content="https://raw.githubusercontent.com/Solarin-Johnson/my-app/refs/heads/main/assets/images/twitter-cover.png"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="My App" />
      <meta
        name="twitter:description"
        content="My personal Expo playground for React Native animations and UI experiments"
      />
    </Head>
  );
}
