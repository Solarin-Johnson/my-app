import { View, StyleSheet, TextInput } from "react-native";
import React, { useRef } from "react";
import Rotate3d, { Rotate3dHandle, Rotate3dProps } from "@/components/3dRotate";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import PressableBounce from "@/components/PresableBounce";
import { useSharedValue } from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { ThemedViewWrapper } from "@/components/ThemedView";
import DrawPad, { DrawPadHandle } from "expo-drawpad";

export default function Index({
  children,
  ...rotate3dProps
}: {
  children?: React.ReactNode;
} & Rotate3dProps) {
  const rotateRef = useRef<Rotate3dHandle>(null);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      style={{ flex: 1 }}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
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
        {...rotate3dProps}
      />
      {children}
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
      <InputField label="Received by" placeholder="Enter name" />
      <SubmitButton onPress={goForward} />
    </View>
  </ItemWrapper>
);

const BackContent = ({ goBack }: { goBack: () => void }) => {
  const padRef = useRef<DrawPadHandle>(null);
  const pathLength = useSharedValue<number>(0);
  const text = useThemeColor("slackText");

  const clearPad = () => {
    padRef.current?.erase();
  };

  return (
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
        <PressableBounce onPress={clearPad} bounceScale={0.9}>
          <ThemedTextWrapper>
            <RotateCcw strokeWidth={2.4} size={23} />
          </ThemedTextWrapper>
        </PressableBounce>
      </View>
      <DrawPad ref={padRef} pathLength={pathLength} stroke={text} />
      <SubmitButton title="Confirm" hideIcon />
    </ItemWrapper>
  );
};

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

const SubmitButton = ({
  onPress,
  title = "Next",
  hideIcon = false,
}: {
  onPress?: () => void;
  title?: string;
  hideIcon?: boolean;
}) => {
  const text = useThemeColor("text");
  return (
    <ThemedViewWrapper colorName="text">
      <PressableBounce onPress={onPress} style={[styles.button]}>
        <ThemedText colorName="background" type="semiBold">
          {title}
        </ThemedText>
        {!hideIcon && (
          <ThemedTextWrapper colorName="background">
            <ArrowRight size={20} strokeWidth={2.4} />
          </ThemedTextWrapper>
        )}
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
