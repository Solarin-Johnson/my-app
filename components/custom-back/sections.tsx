import { StyleSheet, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { Link, LinkProps } from "expo-router";
import PressableBounce from "../PresableBounce";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import { ChevronRight } from "lucide-react-native";
import { isAndroid } from "@/constants";

export const SectionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <ThemedView style={styles.sectionContainer} colorName="untitledBg">
    {children}
  </ThemedView>
);

export const SectionItem = ({
  title,
  description,
  href,
}: {
  title: string;
  description?: string;
  href: LinkProps["href"];
}) => (
  <Link href={href} asChild>
    <Link.Trigger>
      <PressableBounce
        style={styles.sectionItem}
        bounceScale={isAndroid ? 0.99 : 1}
      >
        <View style={styles.sectionContent}>
          <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
          {/* <ThemedText style={styles.sectionDescription}>{description}</ThemedText> */}
        </View>
        <ThemedTextWrapper style={styles.sectionArrow}>
          <ChevronRight />
        </ThemedTextWrapper>
      </PressableBounce>
    </Link.Trigger>
    <Link.Preview />
  </Link>
);

export const SectionDivider = () => (
  <ThemedView
    style={{
      height: 1,
      marginHorizontal: 16,
      opacity: 0.12,
    }}
    colorName="slackText"
  />
);

const styles = StyleSheet.create({
  sectionContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  sectionItem: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
  },
  sectionArrow: {
    opacity: 0.9,
  },
});
