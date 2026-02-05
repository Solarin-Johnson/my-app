import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Link, router, Stack } from "expo-router";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView, ThemedViewWrapper } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

const DATA = [
  {
    id: "123",
    title: "Dotted Paper",
    date: "Today",
    image:
      "https://imghop.udocz.com/uploads/book/cover/87713/hoja_de_puntitos.jpg",
  },
  {
    id: "456",
    title: "Random Image 1",
    date: "Yesterday",
    image: "https://picsum.photos/200/150?random=1",
  },
  {
    id: "789",
    title: "Random Image 2",
    date: "2 days ago",
    image: "https://picsum.photos/200/150?random=2",
  },
];

export default function Index() {
  const color = useThemeColor("invertedTheme");
  return (
    <>
      <Stack.Screen.Title style={{ fontSize: 20 }}>Drawpad</Stack.Screen.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon="ellipsis" palette></Stack.Toolbar.Menu>
      </Stack.Toolbar>
      <Stack.SearchBar onChangeText={() => {}} />
      <Stack.Toolbar placement="bottom">
        <Stack.Toolbar.SearchBarSlot />
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button
          icon={"square.and.pencil"}
          onPress={() => router.navigate("/freeform/001")}
        />
      </Stack.Toolbar>

      <ThemedViewWrapper colorName="captchaBg">
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            padding: 16,
          }}
          contentInsetAdjustmentBehavior="automatic"
        >
          {DATA.map((item) => (
            <Link key={item.id} href={`/freeform/${item.id}`} asChild>
              <Link.Trigger withAppleZoom>
                <Pressable style={styles.card}>
                  <View style={styles.container}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={"sf:scribble.variable"}
                        style={styles.image}
                        tintColor={"#888888"}
                      />
                    </View>

                    <ThemedView style={styles.content} colorName="safariBg">
                      <ThemedText style={styles.title} type="semiBold">
                        {item.title}
                      </ThemedText>
                      <ThemedText style={styles.subtitle}>
                        {item.date}
                      </ThemedText>
                    </ThemedView>
                  </View>
                </Pressable>
              </Link.Trigger>

              <Link.Menu>
                <Link.MenuAction icon="pencil">Rename</Link.MenuAction>
                <Link.MenuAction icon="star">Favorite</Link.MenuAction>
                <Link.MenuAction icon="square.and.arrow.up">
                  Share
                </Link.MenuAction>
                <Link.MenuAction icon="plus.square.on.square">
                  Duplicate
                </Link.MenuAction>
                <Link.MenuAction icon="trash" destructive>
                  Delete
                </Link.MenuAction>
              </Link.Menu>
            </Link>
          ))}
          {/* <View style={{ height: 1200 }} /> */}
        </ScrollView>
      </ThemedViewWrapper>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: "47%",
    height: 170,
    marginBottom: 12,
  },
  container: {
    flex: 1,
    borderRadius: 14,
    // overflow: "hidden",
    borderWidth: 1,
    borderColor: "#00000030",
    borderCurve: "continuous",
  },
  content: {
    height: 60,
    padding: 8,
    gap: 2,
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
    borderCurve: "continuous",
  },
  title: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.5,
  },
  image: {
    width: 50,
    aspectRatio: 1,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderCurve: "continuous",
    backgroundColor: "white",
  },
});
