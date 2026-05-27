import React from "react";
import Item from "./item";
import AccordionContainer, { AccordionContainerProps } from "./container";

type AccordionComponent = React.FC<AccordionContainerProps> & {
  Item: typeof Item;
};

const Accordion = AccordionContainer as AccordionComponent;
Accordion.Item = Item;

Accordion.displayName = "Accordion";

export { Accordion };
