import React from "react";
import AccordionProvider, { AccordionProviderProps } from "./provider";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ItemProps } from "./item";

export type AccordionContainerProps = AccordionProviderProps & {
  style?: StyleProp<ViewStyle>;
  useDefaultStyles?: boolean;
};

const AccordionContainer = ({
  children,
  useDefaultStyles,
  style = useDefaultStyles ? styles.container : undefined,
  ...props
}: AccordionContainerProps) => {
  return (
    <AccordionProvider {...props}>
      <View style={style}>
        {React.Children.map(children, (child, index) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<ItemProps>, {
                index,
              })
            : child,
        )}
      </View>
    </AccordionProvider>
  );
};

export default AccordionContainer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    backgroundColor: "#88888818",
    borderRadius: 18,
    borderCurve: "continuous",
  },
});
