import React from "react";
import { View, StyleSheet } from "react-native";
import { DATA } from "./config";
import { ThemedText } from "../ThemedText";
import { Image } from "expo-image";
import { Link } from "expo-router";

const MessageBox = () => {
  const saveImage = () => {
    console.log("Save image");
  };

  const handleSharePress = () => {
    console.log("Share image");
  };

  const handleBlockPress = () => {
    console.log("Block user");
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          source={require("@/assets/images/dp.png")}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.rightContainer}>
        <ThemedText
          colorName="slackText"
          type="defaultSemiBold"
          style={styles.senderName}
        >
          {DATA.name}
        </ThemedText>
        <Link href={"/slack-liquid-glass/chat"}>
          <Link.Trigger>
            <Image
              source={"https://i.imgur.com/XklVVPx.jpeg"}
              style={styles.messageImage}
            />
          </Link.Trigger>
          <Link.Menu>
            <Link.MenuAction
              title="Save"
              icon="square.and.arrow.down"
              onPress={saveImage}
            />
           
          </Link.Menu>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    paddingTop: 24,
    gap: 10,
  },
  leftContainer: {},
  rightContainer: {
    flex: 1,
    gap: 2,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderCurve: "continuous",
  },
  senderName: {
    fontSize: 17,
    marginBottom: 5,
  },
  messageImage: {
    width: "100%",
    height: 450,
    borderRadius: 8,
    borderCurve: "continuous",
  },
});

export default MessageBox;
