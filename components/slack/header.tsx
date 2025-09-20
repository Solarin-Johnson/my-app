import { Sparkles } from "lucide-react-native";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import { NativeStackHeaderRightProps } from "react-native-screen-transitions";
import { ThemedTextWrapper } from "../ThemedText";
import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import Island, { Cords } from "./island";
import {
  measure,
  SharedValue,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { ANIMATION_DELAY } from "./config";

export default function HeaderTitle({}: {
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
      //   console.log({ x, y, width, height, pageX, pageY });
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

  const onClose = () => {
    opened.value = false;
    setTimeout(() => {
      setVisible(false);
    }, ANIMATION_DELAY);
  };

  return (
    <Modal
      transparent
      visible={visible}
      onDismiss={onClose}
      onRequestClose={onClose}
      // animationType={visible ? "none" : "fade"}
    >
      <Pressable style={styles.underlay} onPress={onClose} />
      <View style={{ marginTop: top, flex: 1 }}>
        <Island cords={cords} modal opened={opened} onClose={onClose} />
      </View>
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
            <ThemedTextWrapper colorName="slackText">
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
  underlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: "red",
  },
});
