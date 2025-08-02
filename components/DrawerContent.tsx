import React, { memo, useCallback, useEffect, useState } from "react";
import {
  DrawerContentComponentProps,
  DrawerItemList,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import TextLink from "./ui/TextLink";
import config from "@/constants/config.json";
import { Home } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFocusEffect, useRouter } from "expo-router";
import { Feedback } from "@/functions";

const DrawerContent = memo((props: DrawerContentComponentProps) => {
  const demos = (props.state?.routes?.length || 0) - 3 || 0;
  const status = useDrawerStatus();
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (focused) {
      Feedback.light();
    }
  }, [status]);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => {
        setFocused(false);
      };
    }, [])
  );

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <Header routes={demos} />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <DrawerItemList {...props} />
      </ScrollView>
      <DrawerFooter />
    </SafeAreaView>
  );
});

const Header = ({ routes }: { routes: number }) => {
  const text = useThemeColor("text");
  const textColor = text + "EA";
  const router = useRouter();

  const handlePress = () => {
    router.push("/");
  };

  return (
    <View
      style={[
        styles.header,
        {
          borderColor: text + "18",
        },
      ]}
    >
      <Pressable style={styles.headerButton} onPress={handlePress}>
        <Home size={20} color={"#A0A0A0"} />
        <ThemedText style={[styles.headerText, { color: textColor }]}>
          Home
        </ThemedText>
      </Pressable>
      <ThemedText>
        {routes}
        <Text style={styles.demoText}>{routes > 1 ? " demos" : " demo"}</Text>
      </ThemedText>
    </View>
  );
};

const DrawerFooter = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.cluster}>
        <Image
          source={require("@/assets/images/dp.png")}
          style={styles.image}
        />
        <ThemedText style={styles.footerText}>Solarin</ThemedText>
      </View>
      <View style={styles.cluster}>
        <TextLink link={config.contact.twitter} style={styles.contactIcon}>
          <FontAwesome6 name="x-twitter" size={21} />
        </TextLink>
        <TextLink link={config.contact.github} style={styles.contactIcon}>
          <FontAwesome6 name="github" size={21} />
        </TextLink>
      </View>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 12,
    gap: 6,
  },
  header: {
    marginHorizontal: 12,
    paddingHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 6,
  },
  headerText: {
    fontSize: 15,
  },
  demoText: {
    fontSize: 14,
    opacity: 0.7,
  },
  footer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  image: {
    width: 32,
    aspectRatio: 1,
    borderRadius: 16,
  },
  footerText: {
    fontSize: 18,
  },
  cluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactIcon: {
    padding: 4,
  },
});
