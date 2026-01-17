import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Stacked } from "@/components/stacked-input";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText, ThemedTextWrapper } from "@/components/ThemedText";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useStackedInput } from "@/components/stacked-input/provider";
import { BlurView } from "expo-blur";
import { ThemedView, ThemedViewWrapper } from "@/components/ThemedView";
import PressableBounce from "@/components/PresableBounce";

const AnimatedPressable = Animated.createAnimatedComponent(PressableBounce);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const SPRING_CONFIG = {
  damping: 10,
  stiffness: 80,
  mass: 0.6,
};

export default function Index() {
  return (
    <ThemedView style={{ flex: 1 }} colorName="safariBg">
      <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        // contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          Invite a friend
        </ThemedText>
        <StackInputContainer />
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </ThemedView>
  );
}

const StackInputContainer = () => {
  const currentIndex = useSharedValue(0);
  const text = useThemeColor("text");
  const bg = useThemeColor("background");

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <Stacked.Provider
      currentIndex={currentIndex}
      itemStyles={{ borderColor: text + "25", borderWidth: 1.4 }}
      itemProps={{ selectionColor: text }}
      maxIndex={2}
    >
      <View style={styles.stack}>
        <Stacked.Input
          index={0}
          placeholder="Friend's Name"
          autoCapitalize="words"
        />
        <Stacked.Input
          index={1}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Friend's Email"
        />
        <Stacked.Input index={2}>
          <Stacked.Switch
            title="Send a reminder in 5 days"
            textProps={{
              style: {
                color: "#888888",
                fontSize: 16,
              },
              type: "semiBold",
            }}
            trackColor={{ true: text }}
            thumbColor={bg}
            value={isEnabled}
            onValueChange={toggleSwitch}
          />
        </Stacked.Input>
      </View>
      <StackControl />
    </Stacked.Provider>
  );
};

const StackControl = () => {
  return (
    <View style={styles.controlContainer}>
      <Stacked.Trigger type="previous" asChild>
        <BackButton />
      </Stacked.Trigger>
      <Stacked.Trigger type="next" asChild>
        <RightButton title="Next" />
      </Stacked.Trigger>
    </View>
  );
};

const BackButton = ({ onPress }: { onPress?: () => void }) => {
  const { currentIndex } = useStackedInput();
  const text = useThemeColor("text");

  const isStart = useDerivedValue(() => {
    return currentIndex.value === 0;
  });

  const intensity = useDerivedValue<number | undefined>(() => {
    return withSpring(isStart.value ? 20 : 0, SPRING_CONFIG);
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isStart.value ? 0 : 1, SPRING_CONFIG),
      pointerEvents: isStart.value ? "none" : "auto",
    };
  });

  return (
    <AnimatedPressable
      style={[styles.back, { backgroundColor: text + "18" }, animatedStyle]}
      onPress={onPress}
      hitSlop={8}
    >
      <ThemedTextWrapper>
        <FontAwesome6 name="arrow-left" size={20} />
      </ThemedTextWrapper>
      <AnimatedBlurView
        intensity={intensity}
        style={[StyleSheet.absoluteFill]}
        pointerEvents={"none"}
      />
    </AnimatedPressable>
  );
};

const RightButton = ({ onPress }: { title: string; onPress?: () => void }) => {
  const { currentIndex, maxIndex } = useStackedInput();

  const nextInview = useDerivedValue(() => {
    return currentIndex.value < (maxIndex ?? 1);
  });

  const doneInview = useDerivedValue(() => {
    return currentIndex.value === (maxIndex ?? 1);
  });

  return (
    <ThemedViewWrapper colorName="text">
      <PressableBounce onPress={onPress} style={[styles.right]} hitSlop={8}>
        <RightButtonCluster
          title="Next"
          icon="arrow-right"
          inView={nextInview}
        />
        <RightButtonCluster
          title="Done"
          icon="check"
          iconPosition="left"
          inView={doneInview}
        />
      </PressableBounce>
    </ThemedViewWrapper>
  );
};

const RightButtonCluster = ({
  title,
  icon,
  iconPosition = "right",
  inView,
}: {
  title: string;
  icon: React.ComponentProps<typeof FontAwesome6>["name"];
  iconPosition?: "left" | "right";
  inView?: SharedValue<boolean>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    if (!inView) return {};
    return {
      opacity: withSpring(inView.value ? 1 : 0, SPRING_CONFIG),
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    if (!inView) return {};
    const offset = iconPosition === "left" ? -20 : 20;
    return {
      transform: [
        {
          translateX: withSpring(inView.value ? 0 : offset, SPRING_CONFIG),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.cluster, animatedStyle]}>
      {iconPosition === "left" && (
        <Animated.View style={iconAnimatedStyle}>
          <ThemedTextWrapper colorName="background">
            <FontAwesome6 name={icon} size={18} />
          </ThemedTextWrapper>
        </Animated.View>
      )}
      <ThemedText
        type="semiBold"
        style={{ fontSize: 18 }}
        colorName="background"
      >
        {title}
      </ThemedText>
      {iconPosition === "right" && (
        <Animated.View style={iconAnimatedStyle}>
          <ThemedTextWrapper colorName="background">
            <FontAwesome6 name={icon} size={18} />
          </ThemedTextWrapper>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
  },
  stack: {
    marginTop: 20,
    height: 52,
    marginBottom: 16,
  },
  controlContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  back: {
    width: 45,
    height: 45,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    width: 100,
    height: 45,
    borderRadius: 50,
    borderCurve: "continuous",
  },
  cluster: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...StyleSheet.absoluteFillObject,
  },
});
