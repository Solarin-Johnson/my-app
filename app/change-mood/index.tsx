import MoodChange from "@/components/change-mood";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedViewWrapper } from "@/components/ThemedView";

const MOOD_COLORS = ["#3E26B1", "#193FC0", "#5798AF", "#C6A235", "#ED7F46"];
const MOOD_TITLES = [
  "Very Unpleasant",
  "Unpleasant",
  "Neutral",
  "Pleasant",
  "Very Pleasant",
];

export default function Index() {
  return (
    <ThemedViewWrapper colorName="black">
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <MoodChange>
          <MoodChange.Container>
            <MoodChange.Title titles={MOOD_TITLES} colors={MOOD_COLORS} />
            {MOOD_COLORS.map((color) => (
              <MoodChange.Item key={color} tintColor={color} />
            ))}
          </MoodChange.Container>
        </MoodChange>
      </SafeAreaView>
    </ThemedViewWrapper>
  );
}
