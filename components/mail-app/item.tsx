import { StyleSheet, View } from "react-native";
import React from "react";
import { Button, Section, SwipeActions, VStack } from "@expo/ui/swift-ui";
import { Column, Host, List, Text } from "@expo/ui";
import { background, tint } from "@expo/ui/swift-ui/modifiers";

export default function MailThumb() {
  return (
    <>
      <SwipeActions modifiers={[tint("blue")]}>
        <Column>
          <Text>Message from Expo</Text>
          <Text>Message from Expo</Text>
          <Text>Message from Expo</Text>
          <Text>Message from Expo</Text>
          <Text>Message from Expo</Text>
        </Column>

        <SwipeActions.Actions edge="leading" allowsFullSwipe={false}>
          <Button label="Pin" systemImage="pin" onPress={() => {}} />
        </SwipeActions.Actions>

        <SwipeActions.Actions edge="trailing">
          <Button
            label="Delete"
            systemImage="trash"
            role="destructive"
            onPress={() => {
              console.log("deleted");
            }}
          />
          <Button
            label="Delete"
            systemImage="trash"
            role="destructive"
            onPress={() => {}}
          />
        </SwipeActions.Actions>
      </SwipeActions>
    </>
  );
}

const styles = StyleSheet.create({});
