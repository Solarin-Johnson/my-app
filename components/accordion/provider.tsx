import React, { createContext, useContext, useState, ReactNode } from "react";

interface AccordionContextProps {
  currentIndex: number | null;
  setCurrentIndex: (index: number | null) => void;
}

const AccordionContext = createContext<AccordionContextProps | undefined>(
  undefined,
);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      "useAccordionContext must be used within an AccordionProvider",
    );
  }
  return context;
};

export interface AccordionProviderProps {
  children: ReactNode;
}

const Provider: React.FC<AccordionProviderProps> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  return (
    <AccordionContext.Provider value={{ currentIndex, setCurrentIndex }}>
      {children}
    </AccordionContext.Provider>
  );
};

export default Provider;
