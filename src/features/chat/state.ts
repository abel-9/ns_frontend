import type {
  AssistantFinalEvent,
  ChatConnectionState,
  ChatDomainError,
  ChatHistoryResponse,
  ChatMessage,
  ConversationStartedEvent,
} from "./types";

const DUPLICATE_SEND_DEBOUNCE_MS = 350;

const createMessage = ({
  role,
  content,
  id,
  createdAt,
  citations,
}: {
  role: "user" | "assistant";
  content: string;
  id?: string;
  createdAt?: string;
  citations?: ChatMessage["citations"];
}): ChatMessage => ({
  id: id ?? crypto.randomUUID(),
  role,
  content,
  createdAt: createdAt ?? new Date().toISOString(),
  citations,
});

export interface ChatSessionState {
  connection: ChatConnectionState;
  conversationId: string | null;
  timeline: ChatMessage[];
  pendingSend: boolean;
  lastError: ChatDomainError | null;
  lastSendAt: number | null;
  ready: boolean;
}

export type ChatSessionAction =
  | { type: "connection.changed"; connection: ChatConnectionState }
  | { type: "history.hydrated"; payload: ChatHistoryResponse }
  | { type: "conversation.started"; payload: ConversationStartedEvent }
  | { type: "assistant.final"; payload: AssistantFinalEvent }
  | { type: "send.started"; at: number }
  | { type: "send.completed" }
  | { type: "error.received"; error: ChatDomainError }
  | { type: "error.cleared" }
  | { type: "session.ended" };

export const initialChatSessionState: ChatSessionState = {
  connection: "idle",
  conversationId: null,
  timeline: [],
  pendingSend: false,
  lastError: null,
  lastSendAt: null,
  ready: false,
};

export const shouldBlockDuplicateSend = (
  state: ChatSessionState,
  now: number,
): boolean => {
  if (state.pendingSend) {
    return true;
  }

  if (state.lastSendAt === null) {
    return false;
  }

  return now - state.lastSendAt < DUPLICATE_SEND_DEBOUNCE_MS;
};

export const chatSessionReducer = (
  state: ChatSessionState,
  action: ChatSessionAction,
): ChatSessionState => {
  switch (action.type) {
    case "connection.changed": {
      return {
        ...state,
        connection: action.connection,
      };
    }

    case "history.hydrated": {
      return {
        ...state,
        conversationId: action.payload.conversation_id,
        timeline: action.payload.messages,
        ready: true,
        lastError: null,
      };
    }

    case "conversation.started": {
      return {
        ...state,
        conversationId: action.payload.conversation_id,
        ready: true,
        pendingSend: false,
        lastError: null,
      };
    }

    case "assistant.final": {
      const userMessage = createMessage({
        role: "user",
        content: action.payload.user_message.content,
        id: action.payload.user_message.id,
        createdAt: action.payload.user_message.created_at,
      });

      const assistantMessage = createMessage({
        role: "assistant",
        content: action.payload.assistant_message.content,
        id: action.payload.assistant_message.id,
        createdAt: action.payload.assistant_message.created_at,
        citations: action.payload.assistant_message.citations,
      });

      return {
        ...state,
        conversationId: action.payload.conversation_id,
        timeline: [...state.timeline, userMessage, assistantMessage],
        pendingSend: false,
        ready: true,
        lastError: null,
      };
    }

    case "send.started": {
      return {
        ...state,
        pendingSend: true,
        lastSendAt: action.at,
      };
    }

    case "send.completed": {
      return {
        ...state,
        pendingSend: false,
      };
    }

    case "error.received": {
      return {
        ...state,
        pendingSend: false,
        lastError: action.error,
      };
    }

    case "error.cleared": {
      return {
        ...state,
        lastError: null,
      };
    }

    case "session.ended": {
      return {
        ...initialChatSessionState,
        connection: "disconnected",
      };
    }

    default:
      return state;
  }
};
