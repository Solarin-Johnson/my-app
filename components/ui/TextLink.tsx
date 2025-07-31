import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ThemedText, ThemedTextProps, ThemedTextWrapper } from "../ThemedText";
import * as WebBrowser from "expo-web-browser";
import { isValidElement } from "react";

interface TextLinkProps extends TouchableOpacityProps {
  children: React.ReactNode;
  link: string;
  textProps?: Omit<ThemedTextProps, "children">;
}

const TextLink = ({
  children,
  link,
  textProps,
  ...touchableProps
}: TextLinkProps) => {
  const onPress = () => {
    WebBrowser.openBrowserAsync(link);
  };

  const content =
    typeof children === "string" ? (
      <ThemedText {...textProps}>{children}</ThemedText>
    ) : isValidElement(children) ? (
      <ThemedTextWrapper {...textProps} ignoreStyle>
        {children}
      </ThemedTextWrapper>
    ) : null;

  return (
    <TouchableOpacity {...touchableProps} onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
};

export default TextLink;
