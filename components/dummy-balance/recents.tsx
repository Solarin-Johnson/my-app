import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { ReactElement, ReactNode } from "react";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import {
  ArrowDown,
  CarFront,
  LucideIcon,
  LucideProps,
  ShoppingBag,
  ShoppingBasket,
  TvMinimalPlay,
} from "lucide-react-native";
import { ThemedView, ThemedViewWrapper } from "../ThemedView";
import { USERS_DUMMY_DATA } from "@/constants";
import { Image } from "expo-image";
import PressableBounce from "../PresableBounce";

const ITEMS = [
  {
    icon: <CarFront strokeWidth={1.9} />,
    title: "Uber",
    type: "transport",
    amount: "-$9.29",
  },
  {
    icon: <TvMinimalPlay strokeWidth={1.9} size={23} />,
    title: "Netflix",
    type: "subscription",
    amount: "-$10.99",
  },
  {
    icon: <ShoppingBag strokeWidth={1.9} />,
    title: "Amazon",
    type: "subscription",
    amount: "-$75.00",
  },
  {
    icon: <ArrowDown strokeWidth={1.9} />,
    title: "Cash In",
    type: "transfer",
    amount: "+$150.00",
  },
];

export default function RecentsTransactions() {
  return (
    <View style={styles.container}>
      <Header label="Transactions" />
      <View style={styles.itemContainer}>
        {ITEMS.map((item, index) => (
          <Item
            key={index}
            icon={item.icon}
            title={item.title}
            type={item.type as "credit" | "debit"}
            amount={item.amount}
          />
        ))}
      </View>
    </View>
  );
}

const Header = ({
  label,
  viewAll = true,
}: {
  label: string;
  viewAll?: boolean;
}) => {
  return (
    <View style={styles.header}>
      <ThemedText style={styles.title}>{label}</ThemedText>
      {viewAll && <ThemedText style={styles.subtitle}>View all</ThemedText>}
    </View>
  );
};

const Item = ({
  icon,
  title,
  type,
  amount,
}: {
  icon: ReactElement<LucideProps>;
  title: string;
  type: string;
  amount: string;
}) => {
  return (
    <View style={styles.item}>
      <ThemedView
        style={styles.iconWrapper}
        colorName="invertedTheme"
        alphaHex="12"
      >
        <ThemedTextWrapper style={styles.icon}>{icon}</ThemedTextWrapper>
      </ThemedView>
      <View style={styles.details}>
        <ThemedText style={styles.name}>{title}</ThemedText>
        <ThemedText style={styles.type}>{type}</ThemedText>
      </View>
      <ThemedText style={[styles.amount]}>{amount}</ThemedText>
    </View>
  );
};

export const QuickSend = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        <Header label="Quick Send" viewAll={false} />
      </View>
      <ScrollView
        contentContainerStyle={styles.quickSend}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <QuickReceipents />
      </ScrollView>
    </View>
  );
};

const QuickReceipents = () => {
  return (
    <View style={styles.quickReceipents}>
      {USERS_DUMMY_DATA.map((user) => (
        <PressableBounce key={user.id} style={styles.receipent}>
          <ThemedViewWrapper colorName="invertedTheme" alphaHex="12">
            <Image source={user.image} style={styles.receipentImage} />
          </ThemedViewWrapper>
          <ThemedText style={styles.receipentName}>
            {user.name.split(" ")[0]}
          </ThemedText>
        </PressableBounce>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 3,
    gap: 7,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 14,
    alignItems: "center",
  },
  title: {
    fontSize: 23,
    fontFamily: "ui-monospace",
    fontWeight: 600,
    letterSpacing: -1.75,
  },
  subtitle: {
    fontFamily: "ui-monospace",
    letterSpacing: -1.75,
    fontWeight: 600,
    opacity: 0.5,
  },
  itemContainer: {
    gap: 14,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    height: 58,
  },
  iconWrapper: {
    height: 58,
    aspectRatio: 1,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.75,
  },
  icon: {},
  details: {
    flex: 1,
    gap: 3,
  },
  amount: {
    fontSize: 17,
    fontFamily: "ui-monospace",
    fontWeight: 500,
    letterSpacing: -0.5,
  },
  name: {
    fontSize: 17,
    fontFamily: "ui-monospace",
    fontWeight: 500,
    letterSpacing: -0.5,
    textTransform: "capitalize",
  },
  type: {
    textTransform: "capitalize",
    fontSize: 14,
    fontFamily: "ui-monospace",
    fontWeight: 500,
    letterSpacing: -0.5,
    opacity: 0.5,
  },
  quickSend: {},
  quickSendContent: {},
  quickReceipents: {
    gap: 12,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  receipent: {
    alignItems: "center",
    gap: 8,
  },
  receipentImage: {
    width: 80,
    aspectRatio: 1,
    borderRadius: 24,
  },
  receipentName: {
    fontSize: 14,
    fontFamily: "ui-monospace",
    fontWeight: 500,
    letterSpacing: -0.5,
    opacity: 0.75,
    pointerEvents: "none",
  },
});
