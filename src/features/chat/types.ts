export type ChatInboundEventType =
  | "conversation.started"
  | "assistant.final"
  | "error";

export type ChatRole = "user" | "assistant";

export type ChatConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "auth-failed";

export interface ChatCitation {
  id?: string;
  title?: string;
  url?: string;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  citations?: ChatCitation[];
  createdAt: string;
}

export interface ConversationStartedEvent {
  type: "conversation.started";
  conversation_id: string;
}

export interface AssistantFinalEvent {
  type: "assistant.final";
  conversation_id: string;
  user_message: {
    id?: string;
    content: string;
    created_at?: string;
  };
  assistant_message: {
    id?: string;
    content: string;
    created_at?: string;
    citations?: ChatCitation[];
  };
}

export interface ChatErrorEvent {
  type: "error";
  code: string;
  message: string;
  recoverable?: boolean;
}

export type ChatInboundEvent =
  | ConversationStartedEvent
  | AssistantFinalEvent
  | ChatErrorEvent;

export interface ChatSendPayload {
  message: string;
  conversation_id?: string;
}

export interface ChatHistoryResponse {
  conversation_id: string;
  messages: ChatMessage[];
}

export interface ChatDomainError {
  kind: "auth" | "network" | "not_found" | "server" | "backend" | "unknown";
  message: string;
  recoverable: boolean;
  status?: number;
  code?: string;
}
