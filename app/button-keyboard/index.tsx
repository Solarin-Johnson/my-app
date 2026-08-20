import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonKeyboard, {
  ButtonKeyboardInputRef,
} from "@/components/button-keyboard";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { useButtonKeyboard } from "@/components/button-keyboard/provider";
import { Pressable, StyleSheet, View } from "react-native";
import { UIConditionalRender } from "@/components/UIConditionalRender";
import { useDerivedValue } from "react-native-reanimated";
import { Delete, PencilLine } from "lucide-react-native";
import PressableBounce from "@/components/PresableBounce";

export default function ButtonKeyboardPage() {
  const inputRef = useRef<ButtonKeyboardInputRef>(null!);

  const blurInput = () => {
    inputRef.current.blur();
  };

  const handleDelete = () => {
    inputRef.current.delete();
  };

  const handleDeleteAll = () => {
    inputRef.current.deleteAll();
  };

  return (
    <>
      <ButtonKeyboard.AvoidingView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <ThemedTextWrapper
            type="italic"
            ignoreStyle={false}
            style={{
              fontSize: 36,
              textAlign: "center",
              // backgroundColor: "#00000010",
            }}
          >
            <ButtonKeyboard.Input
              ref={inputRef}
              placeholder="@username"
              autoFocus
              fixedPretext="@"
            />
          </ThemedTextWrapper>
          {/* <ThemedTextWrapper>
        <ButtonKeyboard.Input placeholder="@username" />
      </ThemedTextWrapper> */}
          {/* <Pressable onPress={() => inputRef.current.delete()}>
        <ThemedText>delete</ThemedText>
      </Pressable>
      <Pressable onPress={() => inputRef.current.deleteAll()}>
        <ThemedText>delete all</ThemedText>
      </Pressable>
      <Pressable onPress={() => inputRef.current.blur()}>
        <ThemedText>blur</ThemedText>
      </Pressable>
      <Pressable onPress={() => inputRef.current.focus()}>
        <ThemedText>focus</ThemedText>
      </Pressable> */}
        </SafeAreaView>
      </ButtonKeyboard.AvoidingView>
      <ButtonKeyboard.Toolbar style={[styles.toolbar, {}]}>
        <HashStatePreview
          blurInput={blurInput}
          handleDelete={handleDelete}
          handleDeleteAll={handleDeleteAll}
        />
      </ButtonKeyboard.Toolbar>
    </>
  );
}

const HashStatePreview = ({
  blurInput,
  handleDelete,
  handleDeleteAll,
}: {
  blurInput: () => void;
  handleDelete: () => void;
  handleDeleteAll: () => void;
}) => {
  const { hashState } = useButtonKeyboard();

  const hashStateIndex = useDerivedValue<number>(() => {
    switch (hashState.value) {
      case "CAPITALIZE":
        return 1;
      case "UPPERCASE":
        return 2;
      case "LOWERCASE":
        return 3;
      case "NUMBERS":
        return 4;
    }
  });

  return (
    <View style={styles.preview}>
      <Pressable style={styles.hashState} onPress={blurInput}>
        <ThemedTextWrapper>
          <PencilLine size={20} />
        </ThemedTextWrapper>
        <UIConditionalRender
          animationConfig={{ duration: 0 }}
          currentIndex={hashStateIndex}
          style={{ width: 50 }}
          elements={[
            <ThemedText style={styles.text}>Abc</ThemedText>,
            <ThemedText style={styles.text}>ABC</ThemedText>,
            <ThemedText style={styles.text}>abc</ThemedText>,
            <ThemedText style={styles.text}>123</ThemedText>,
          ]}
        />
      </Pressable>
      <PressableBounce onPress={handleDelete} onLongPress={handleDeleteAll}>
        <ThemedTextWrapper>
          <Delete size={30} strokeWidth={1.8} />
        </ThemedTextWrapper>
      </PressableBounce>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  toolbar: {
    height: 54,
    borderWidth: 2.5,
    borderBottomWidth: 0,
    borderColor: "#88888888",
    overflow: "hidden",
  },
  text: {
    fontSize: 20,
    fontFamily: "ui-monospace",
    fontWeight: "500",
  },
  preview: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    opacity: 0.85,
  },
  hashState: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
  },
  arrows: {
    flexDirection: "row",
    alignItems: "center",
  },
});
