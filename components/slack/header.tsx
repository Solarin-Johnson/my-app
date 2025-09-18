import { Sparkles } from "lucide-react-native";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { NativeStackHeaderRightProps } from "react-native-screen-transitions";
import { ThemedText, ThemedTextWrapper } from "../ThemedText";
import { Button, ContextMenu, Host, Text as UIText } from "@expo/ui/swift-ui";
import { scaleEffect, opacity } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import Island, { ANIMATION_DELAY, Cords } from "./island";
import {
  measure,
  SharedValue,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

export default function HeaderTitle({
  children,
  tintColor,
  style,
}: {
  children: React.ReactNode;
  tintColor?: string;
  style?: any;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const islandRef = useAnimatedRef();
  const cords = useSharedValue<Cords>({ x: 0, y: 0, width: 0, height: 0 });

  useDerivedValue(() => {
    const measured = measure(islandRef);
    if (measured !== null) {
      const { x, y, width, height, pageX, pageY } = measured;
      console.log({ x, y, width, height, pageX, pageY });
      cords.value = { x: pageX, y: pageY, width, height };
    } else {
      console.warn("measure: could not measure view");
    }
  });

  return (
    <>
      <Island
        onPress={() => {
          setModalVisible(true);
          console.log("press header title");
        }}
        containerRef={islandRef}
        visible={!modalVisible}
      />
      <ModalHeader
        visible={modalVisible}
        setVisible={setModalVisible}
        cords={cords}
      />
    </>
  );
}

const ModalHeader = ({
  visible,
  setVisible,
  cords,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  cords: SharedValue<Cords>;
}) => {
  const { top } = useSafeAreaInsets();
  const opened = useSharedValue(false);

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={() => {
        setVisible(!visible);
      }}
      animationType="fade"
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          opened.value = false;
          setTimeout(() => {
            setVisible(false);
          }, ANIMATION_DELAY);
        }}
      >
        <View style={{ marginTop: top, flex: 1 }}>
          <Island
            onPress={(e: GestureResponderEvent) => e.stopPropagation()}
            cords={cords}
            modal
            opened={opened}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

export const HeaderRight = ({}: NativeStackHeaderRightProps) => {
  return (
    <Host>
      <ContextMenu>
        <ContextMenu.Items>
          <Button disabled>Unreads</Button>
          <Button variant="bordered">Last 7 days</Button>
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <View style={styles.rightContainer}>
            <ThemedTextWrapper>
              <Sparkles size={20} strokeWidth={1.8} />
            </ThemedTextWrapper>
          </View>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
};

const styles = StyleSheet.create({
  rightContainer: {
    width: 36,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
