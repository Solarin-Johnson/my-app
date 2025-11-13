export type MessageOptions = {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export type MessageType = {
  text: string;
  options?: MessageOptions;
};

export interface NotifyContextType {
  notify: (msg: string, options?: MessageOptions) => void;
  messages: MessageType[];
}
