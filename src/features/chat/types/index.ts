export type ChatMessageRole = "user" | "assistant";

export type Source = {
  id: string;
  title: string;
  type: string;
};

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
  sources: Source[];
  created_at: string;
  pending?: boolean;
};

export type ChatConversation = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
};

export type ChatConversationDetail = {
  id?: string;
  conversation_id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title?: string;
  messages: ChatMessage[];
};

export type ChatFilters = {
  search: string;
  activeConversationId: string | null;
};

export type ChatHandshakeResponse = {
  type: string;
  conversation_id: string;
};

export type TokenEvent = { type: "token"; value: string };
export type DoneEvent = { type: "done" };
export type StreamErrorEvent = { type: "error"; message: string };

export type StreamEvent = TokenEvent | DoneEvent | StreamErrorEvent;

export type SendMessageInput = {
  conversationId: string;
  content: string;
  signal?: AbortSignal;
};
