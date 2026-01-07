import {
  View,
  Text,
  StyleSheet,
  Switch,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import { useShimmerText } from "./_layout";
import Slider from "@/components/Slider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { ColorPicker, Host } from "@expo/ui/swift-ui";

export default function CustomizeScreen() {
  const {
    progress,
    pressed,
    playing,
    rtl,
    setRtl,
    color,
    setColor,
    size,
    duration,
    tintColor,
    setTintColor,
  } = useShimmerText();
  const text = useThemeColor("text");

  return (
    <View style={styles.container}>
      <Cluster label="Progress">
        <Slider
          value={progress}
          max={1}
          pressed={pressed}
          trackColor={text + "40"}
          thumbColor={text}
        />
      </Cluster>
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
      <Cluster label="Duration">
        <Slider
          value={duration}
          max={5000}
          trackColor={text + "40"}
          thumbColor={text}
        />
      </Cluster>
      <Cluster label="Size">
        <Slider
          value={size}
          max={200}
          trackColor={text + "40"}
          thumbColor={text}
        />
      </Cluster>

      <Cluster label="Invert">
        <Switch
          style={{ alignSelf: "flex-end" }}
          value={rtl}
          onValueChange={setRtl}
        />
      </Cluster>
    </View>
  );
}

const Cluster = ({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={[styles.cluster, style]}>
      <ThemedText style={styles.label}>{label}</ThemedText>
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
});
