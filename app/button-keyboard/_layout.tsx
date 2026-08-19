import ButtonKeyboard from "@/components/button-keyboard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Slot } from "expo-router";

export default function Layout() {
  const bg = useThemeColor("background");
  const text = useThemeColor("text");
  return (
    <ButtonKeyboard.Provider
      padStyle={{ backgroundColor: "#88888888" }}
      keyStyle={{ backgroundColor: bg }}
      charStyle={{ color: text }}
      // letterStyle={{ color: bg }}
    >
      <Slot />
    </ButtonKeyboard.Provider>
  );
}
