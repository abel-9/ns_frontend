import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { createChatHistoryClient } from "./history-client";
import {
  chatSessionReducer,
  initialChatSessionState,
  shouldBlockDuplicateSend,
} from "./state";
import {
  createMockTokenProvider,
  type ChatTokenProvider,
} from "./token-provider";
import type { ChatDomainError } from "./types";
import {
  createChatWebSocketTransport,
  type ChatWebSocketTransport,
} from "./ws-transport";

const CONVERSATION_ID_SESSION_KEY = "chat:conversation_id";

const getConversationIdFromStorage = (): string | null => {
  const fromUrl = new URLSearchParams(window.location.search).get(
    "conversation_id",
  );

  if (fromUrl) {
    return fromUrl;
  }

  return sessionStorage.getItem(CONVERSATION_ID_SESSION_KEY);
};

const syncConversationId = (conversationId: string | null) => {
  const url = new URL(window.location.href);

  if (conversationId) {
    url.searchParams.set("conversation_id", conversationId);
    sessionStorage.setItem(CONVERSATION_ID_SESSION_KEY, conversationId);
  } else {
    url.searchParams.delete("conversation_id");
    sessionStorage.removeItem(CONVERSATION_ID_SESSION_KEY);
  }

  window.history.replaceState({}, "", url);
};

export interface UseChatSessionOptions {
  tokenProvider?: ChatTokenProvider;
  autoReconnect?: boolean;
  createTransport?: (args: {
    token: string;
    onConnectionStateChange: (
      state: Parameters<typeof chatSessionReducer>[1] extends infer A
        ? A extends { type: "connection.changed"; connection: infer C }
          ? C
          : never
        : never,
    ) => void;
    onError: (error: ChatDomainError) => void;
    onConversationStarted: (conversationId: string) => void;
    onAssistantFinal: (event: unknown) => void;
  }) => ChatWebSocketTransport;
  historyClient?: ReturnType<typeof createChatHistoryClient>;
}

export const useChatSession = (options: UseChatSessionOptions = {}) => {
  const [state, dispatch] = useReducer(
    chatSessionReducer,
    initialChatSessionState,
  );
  const tokenProvider = options.tokenProvider ?? createMockTokenProvider();
  const historyClient = useMemo(
    () => options.historyClient ?? createChatHistoryClient(),
    [options.historyClient],
  );
  const transportRef = useRef<ChatWebSocketTransport | null>(null);
  const tokenRef = useRef<string | null>(null);

  const createTransport = useCallback(
    (token: string): ChatWebSocketTransport => {
      if (options.createTransport) {
        return options.createTransport({
          token,
          onConnectionStateChange: (connection) => {
            dispatch({ type: "connection.changed", connection });
          },
          onError: (error) => {
            dispatch({ type: "error.received", error });
          },
          onConversationStarted: (conversationId) => {
            dispatch({
              type: "conversation.started",
              payload: {
                type: "conversation.started",
                conversation_id: conversationId,
              },
            });
            syncConversationId(conversationId);
          },
          onAssistantFinal: (event) => {
            const typedEvent = event as Parameters<typeof dispatch>[0] & {
              payload?: unknown;
            };

            if (typedEvent?.type === "assistant.final" && typedEvent.payload) {
              dispatch(typedEvent as Parameters<typeof dispatch>[0]);
            }
          },
        });
      }

      return createChatWebSocketTransport({
        token,
        autoReconnect: options.autoReconnect ?? true,
        onConnectionStateChange: (connection) => {
          dispatch({ type: "connection.changed", connection });
        },
        onError: (error) => {
          dispatch({ type: "error.received", error });
        },
        onEvent: (event) => {
          if (event.type === "conversation.started") {
            dispatch({
              type: "conversation.started",
              payload: event,
            });
            syncConversationId(event.conversation_id);
          }

          if (event.type === "assistant.final") {
            dispatch({ type: "assistant.final", payload: event });
            syncConversationId(event.conversation_id);
          }

          if (event.type === "error") {
            dispatch({
              type: "error.received",
              error: {
                kind: "backend",
                code: event.code,
                message: event.message,
                recoverable: event.recoverable ?? true,
              },
            });
          }
        },
      });
    },
    [options.autoReconnect, options.createTransport],
  );

  const initialize = useCallback(async () => {
    dispatch({ type: "error.cleared" });

    const token = await tokenProvider.getToken();
    tokenRef.current = token;

    const existingConversationId = getConversationIdFromStorage();

    if (existingConversationId) {
      try {
        const history = await historyClient.getConversationHistory(
          existingConversationId,
          token,
        );
        dispatch({ type: "history.hydrated", payload: history });
        syncConversationId(history.conversation_id);
      } catch (error) {
        dispatch({
          type: "error.received",
          error: error as ChatDomainError,
        });
      }
    }

    const transport = createTransport(token);
    transportRef.current = transport;
    transport.connect();
  }, [createTransport, historyClient, tokenProvider]);

  const sendMessage = useCallback(
    async (message: string) => {
      const now = Date.now();
      if (!message.trim() || shouldBlockDuplicateSend(state, now)) {
        return;
      }

      if (!transportRef.current) {
        dispatch({
          type: "error.received",
          error: {
            kind: "network",
            message: "Chat transport is not initialized",
            recoverable: true,
          },
        });
        return;
      }

      dispatch({ type: "send.started", at: now });

      try {
        transportRef.current.send({
          message,
          conversation_id: state.conversationId ?? undefined,
        });
      } catch (error) {
        dispatch({
          type: "error.received",
          error: error as ChatDomainError,
        });
        return;
      }

      dispatch({ type: "send.completed" });
    },
    [state],
  );

  const reconnect = useCallback(() => {
    dispatch({ type: "error.cleared" });

    if (!transportRef.current) {
      const token = tokenRef.current;
      if (!token) {
        dispatch({
          type: "error.received",
          error: {
            kind: "auth",
            message: "Cannot reconnect without an initialized token",
            recoverable: false,
          },
        });
        return;
      }

      transportRef.current = createTransport(token);
      transportRef.current.connect();
      return;
    }

    transportRef.current.reconnect();
  }, [createTransport]);

  const endSession = useCallback(() => {
    transportRef.current?.disconnect();
    transportRef.current = null;
    tokenRef.current = null;
    syncConversationId(null);
    dispatch({ type: "session.ended" });
  }, []);

  useEffect(() => {
    return () => {
      transportRef.current?.disconnect();
      transportRef.current = null;
    };
  }, []);

  return {
    state,
    initialize,
    sendMessage,
    reconnect,
    endSession,
  };
};
