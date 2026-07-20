import {
  Button,
  Host,
  List,
  Section,
  SwipeActions,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function SwipeActionsExample() {
  return (
    <>
      <Stack.Screen
        options={{
          swipeEdgeWidth: 20,
        }}
      />

      <SwipeActions>
        <VStack>
          <Text>Message from Expo</Text>
          <Text>Message from Expo</Text>
          <Text>Message from Expo</Text>
          <Text>Message from Expo</Text>
          <Text>Message from Expo</Text>
        </VStack>

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
