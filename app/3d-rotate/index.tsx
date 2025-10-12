import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Rotate3d, { Rotate3dHandle } from "@/components/3dRotate";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import PressableBounce from "@/components/PresableBounce";
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import { Host, HStack, Slider } from "@expo/ui/swift-ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  RotateCcw,
} from "lucide-react-native";
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from "react-native-keyboard-controller";
import { ThemedViewWrapper } from "@/components/ThemedView";

const AnimatedSlider = Animated.createAnimatedComponent(Slider);

export default function Index() {
  const rotateRef = useRef<Rotate3dHandle>(null);
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    value: progress.value,
  }));

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      style={{ flex: 1 }}
    >
      <Rotate3d
        ref={rotateRef}
        style={styles.rotateCard}
        frontContent={
          <FrontContent goForward={() => rotateRef.current?.flipTo("back")} />
        }
        backContent={
          <BackContent goBack={() => rotateRef.current?.flipTo("front")} />
        }
        progress={progress}
      />
      {/* <PressableBounce
        onPress={() => {
          rotateRef.current?.flip();
        }}
      >
        <ThemedText>Flip Card</ThemedText>
      </PressableBounce>
      <Host matchContents style={{ minHeight: 100, width: 300 }}>
        <HStack>
          <AnimatedSlider
            min={0}
            max={1}
            steps={0.01}
            animatedProps={animatedProps}
            onValueChange={(value) => {
              progress.value = value;
            }}
          />
        </HStack>
      </Host> */}
    </KeyboardAwareScrollView>
  );
}

const ItemWrapper = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => {
  const text = useThemeColor("text");
  const itemStyle = { borderColor: text + "24" };
  return <View style={[styles.itemStyle, itemStyle, style]}>{children}</View>;
};

const FrontContent = ({ goForward }: { goForward: () => void }) => (
  <ItemWrapper style={styles.frontCard}>
    <View style={styles.header}>
      <ThemedText type="title" style={styles.title}>
        Confirm Delivery
      </ThemedText>
    </View>
    <View style={styles.body}>
      <InputField label="Recipient" value="John Doe" readOnly />
      <InputField label="Package ID" value="PKG123456" readOnly />
      <InputField label="Received by" value="" placeholder="Enter name" />
      <SubmitButton onPress={goForward} />
    </View>
  </ItemWrapper>
);

const BackContent = ({ goBack }: { goBack: () => void }) => (
  <ItemWrapper style={styles.backCard}>
    <View style={styles.header}>
      <PressableBounce onPress={goBack} bounceScale={0.9}>
        <ThemedTextWrapper>
          <ArrowLeft size={26} strokeWidth={2.4} />
        </ThemedTextWrapper>
      </PressableBounce>
      <ThemedText type="title" style={[styles.title, styles.backTitle]}>
        Sign
      </ThemedText>
      <ThemedTextWrapper>
        <RotateCcw strokeWidth={2.4} size={23} />
      </ThemedTextWrapper>
    </View>
  </ItemWrapper>
);

const InputField = ({
  label,
  ...props
}: {
  label?: string;
} & React.ComponentProps<typeof TextInput>) => {
  const text = useThemeColor("text");
  return (
    <View style={styles.inputField}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <ThemedTextWrapper>
        <TextInput
          {...props}
          style={[props.style, styles.input, { backgroundColor: text + "0A" }]}
        />
      </ThemedTextWrapper>
    </View>
  );
};

const SubmitButton = ({ onPress }: { onPress: () => void }) => {
  const text = useThemeColor("text");
  return (
    <ThemedViewWrapper colorName="text">
      <PressableBounce onPress={onPress} style={[styles.button]}>
        <ThemedText colorName="background">Next</ThemedText>
        <ThemedTextWrapper colorName="background">
          <ArrowRight size={20} />
        </ThemedTextWrapper>
      </PressableBounce>
    </ThemedViewWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rotateCard: {
    width: 320,
    height: 364,
    margin: 40,
  },
  itemStyle: {
    flex: 1,
    borderRadius: 30,
    borderCurve: "continuous",
    borderWidth: 1.8,
    boxShadow: "0 0px 8px rgba(0,0,0,0.05)",
    padding: 18,
    overflow: "hidden",
  },
  backCard: {
    borderStyle: "dashed",
    boxShadow: "none",
  },
  frontCard: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
  },
  backTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    pointerEvents: "none",
  },
  body: {
    flex: 1,
    gap: 12,
  },
  inputField: {
    gap: 6,
  },
  label: {
    opacity: 0.6,
    fontSize: 14,
  },
  input: {
    fontSize: 16,
    padding: 12,
    borderRadius: 12,
    borderCurve: "continuous",
  },
  button: {
    padding: 12,
    borderRadius: 12,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    marginTop: 2,
    // alignSelf: "flex-end",
    // width: 150,
  },
});
