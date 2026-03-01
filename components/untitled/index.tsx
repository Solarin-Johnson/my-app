import { StyleSheet, View } from "react-native";
import PressableBounce from "../PresableBounce";
import { StackedButton, StackedButtonItemProps } from "../stacked-button";
import { ThemedText, ThemedTextProps, ThemedTextWrapper } from "../ThemedText";
import { LucideProps } from "lucide-react-native";

export const ButtonItem = ({ children, ...rest }: StackedButtonItemProps) => {
  return (
    <StackedButton.Item {...rest} asChild>
      <PressableBounce bounceScale={0.98}>{children}</PressableBounce>
    </StackedButton.Item>
  );
};

export const ButtonCluster = ({
  text,
  icon,
}: {
  text: string;
  icon?: React.ReactElement;
}) => {
  return (
    <View style={styles.btnCluster}>
      {icon}
      <ThemedText style={styles.btnText}>{text}</ThemedText>
    </View>
  );
};

export const ButtonIcon = ({
  icon: Icon,
  colorName,
  attribute,
  ...props
}: {
  icon: React.ComponentType<any>;
  colorName?: ThemedTextProps["colorName"];
  attribute?: string;
} & LucideProps) => {
  return (
    <ThemedTextWrapper colorName={colorName} attribute={attribute}>
      <Icon size={18.5} {...props} />
    </ThemedTextWrapper>
  );
};

const styles = StyleSheet.create({
  btnCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  btnText: {
    fontSize: 15,
  },
});
