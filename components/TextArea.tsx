import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import Animated from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function TextArea() {
  return (
    <View>
      <AnimatedTextInput
        placeholder="Type something..."
        placeholderTextColor="#888"
        multiline
        numberOfLines={4}
        style={{
          height: 100,
          width: 300,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          textAlignVertical: "center",
        }}
      />
      <View style={styles.handle} />
    </View>
  );
}

const styles = StyleSheet.create({
  handle: {
    width: 20,
    height: 10,
    borderRadius: 2.5,
    backgroundColor: "red",
    position: "absolute",
    right: 4,
    bottom: 4,
  },
});
