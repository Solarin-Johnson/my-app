export type MessageOptions = {
  description?: string;
  expandedChildren?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export type MessageType = {
  id?: number;
  text: string;
  options?: MessageOptions;
};

export interface NotifyContextType {
  notify: (msg: string, options?: MessageOptions) => void;
  messages: MessageType[];
}
