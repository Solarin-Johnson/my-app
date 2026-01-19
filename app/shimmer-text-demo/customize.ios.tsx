import {
  View,
  StyleSheet,
  Switch,
  StyleProp,
  ViewStyle,
  TextInput,
  Platform,
} from "react-native";
import React from "react";
import { useShimmerText } from "./_layout";
import Slider from "@/components/Slider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import { ColorPicker, Host } from "@expo/ui/swift-ui";

const isIos = Platform.OS === "ios";

export default function CustomizeScreen() {
  const {
    progress,
    pressed,
    rtl,
    setRtl,
    color,
    setColor,
    size,
    duration,
    tintColor,
    setTintColor,
    text,
    setText,
  } = useShimmerText();
  const textColor = useThemeColor("text");

  return (
    <View style={styles.container}>
      <Cluster label="Progress">
        <Slider
          value={progress}
          max={1}
          pressed={pressed}
          trackColor={textColor + "40"}
          thumbColor={textColor}
        />
      </Cluster>
      {isIos && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Cluster label="Color" style={{ maxWidth: 100 }}>
            <Host style={{ height: "100%" }}>
              <ColorPicker selection={color} onValueChanged={setColor} />
            </Host>
          </Cluster>
          <Cluster label="Tint Color" style={{ maxWidth: 140 }}>
            <Host style={{ height: "100%" }}>
              <ColorPicker
                selection={tintColor}
                onValueChanged={setTintColor}
                supportsOpacity={false}
              />
            </Host>
          </Cluster>
        </View>
      )}
      <Cluster label="Duration">
        <Slider
          value={duration}
          max={5000}
          trackColor={textColor + "40"}
          thumbColor={textColor}
        />
      </Cluster>
      <Cluster label="Size">
        <Slider
          pressed={pressed}
          value={size}
          max={200}
          trackColor={textColor + "40"}
          thumbColor={textColor}
        />
      </Cluster>

      <Cluster label="Invert">
        <Switch
          style={{ alignSelf: "flex-end" }}
          value={rtl}
          onValueChange={setRtl}
        />
      </Cluster>
      {/* <Cluster label="Preview">
        <ThemedTextWrapper style={[styles.label, styles.input]}>
          <TextInput
            defaultValue={text}
            onSubmitEditing={(e) => setText(e.nativeEvent.text)}
          />
        </ThemedTextWrapper>
      </Cluster> */}
    </View>
  );
}

const Cluster = ({
  label,
  children,
  style,
}: {
  label?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={[styles.cluster, style]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View style={{ maxWidth: 200, flex: 1 }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  cluster: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    // backgroundColor: "red",
    height: 50,
    alignItems: "center",
  },
  label: {
    fontSize: 19,
  },
  input: {
    textAlign: "right",
    borderBottomWidth: 2,
    paddingVertical: 6,
    borderColor: "#888888AB",
  },
});
