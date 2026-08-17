import Input from "./input";
import Pad from "./pad";
import { Provider, type ProviderProps } from "./provider";

const PadProvider = ({ children, ...props }: ProviderProps) => {
  return (
    <Provider {...props}>
      {children}
      <Pad />
    </Provider>
  );
};

const ButtonKeyboard = {
  Provider: PadProvider,
  Input,
};

export default ButtonKeyboard;
