import MoodChange from "@/components/change-mood";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedViewWrapper } from "@/components/ThemedView";

const MOOD_COLORS = ["#3E26B1", "#193FC0", "#5798AF", "#C6A235", "#ED7F46"];

export default function Index() {
  return (
    <ThemedViewWrapper colorName="black">
      <SafeAreaView style={{ flex: 1 }}>
        <MoodChange>
          <MoodChange.Container>
            {MOOD_COLORS.map((color) => (
              <MoodChange.Item key={color} tintColor={color} />
            ))}
          </MoodChange.Container>
        </MoodChange>
      </SafeAreaView>
    </ThemedViewWrapper>
  );
}
