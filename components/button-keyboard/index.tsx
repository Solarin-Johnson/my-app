import Input from "./input";
import Pad from "./pad";
import { Provider, type ProviderProps } from "./provider";
export type * from "./types";

const PadProvider = ({ children, ...props }: ProviderProps) => {
  return (
    <Provider>
      {children}
      <Pad {...props} />
    </Provider>
  );
};

const ButtonKeyboard = {
  Provider: PadProvider,
  Input,
};

export default ButtonKeyboard;
