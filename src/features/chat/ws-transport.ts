import { API_BASE_URL } from "#/const";
import { parseInboundEvent } from "./guards";
import type {
  ChatConnectionState,
  ChatDomainError,
  ChatInboundEvent,
  ChatSendPayload,
} from "./types";
import { mapError } from "./history-client";

interface WebSocketLike {
  readyState: number;
  close(code?: number, reason?: string): void;
  send(data: string): void;
  onopen: ((event: Event) => void) | null;
  onmessage: ((event: MessageEvent<string>) => void) | null;
  onerror: ((event: Event) => void) | null;
  onclose: ((event: CloseEvent) => void) | null;
}

type WebSocketFactory = (url: string) => WebSocketLike;

type TimerFactory = (callback: () => void, timeout: number) => number;

type TimerClear = (timer: number) => void;

const AUTH_CLOSE_CODES = new Set([1008, 4001, 4003]);

const MAX_BACKOFF_MS = 15_000;
const INITIAL_BACKOFF_MS = 500;

const mapCloseToError = (event: CloseEvent): ChatDomainError | null => {
  if (AUTH_CLOSE_CODES.has(event.code)) {
    return {
      kind: "auth",
      message: event.reason || "Authentication failed while connecting to chat",
      recoverable: false,
      code: String(event.code),
    };
  }

  if (event.code !== 1000) {
    return {
      kind: "network",
      message:
        event.reason ||
        "Chat connection closed unexpectedly. You can try reconnecting.",
      recoverable: true,
      code: String(event.code),
    };
  }

  return null;
};

const computeBackoff = (attempt: number): number => {
  const value = INITIAL_BACKOFF_MS * 2 ** Math.max(0, attempt - 1);
  return Math.min(value, MAX_BACKOFF_MS);
};

const buildWebSocketUrl = (
  token: string,
  baseUrl: string = API_BASE_URL,
): string => {
  const httpUrl = new URL(baseUrl, window.location.origin);
  const wsProtocol = httpUrl.protocol === "https:" ? "wss:" : "ws:";
  const wsBasePath = httpUrl.pathname.replace(/\/$/, "");
  const wsUrl = new URL(`${wsProtocol}//${httpUrl.host}${wsBasePath}/chat/ws`);

  wsUrl.searchParams.set("token", `Bearer ${token}`);
  return wsUrl.toString();
};

export interface ChatWebSocketTransport {
  connect(): void;
  send(payload: ChatSendPayload): void;
  reconnect(): void;
  disconnect(): void;
}

interface CreateTransportOptions {
  token: string;
  onEvent: (event: ChatInboundEvent) => void;
  onConnectionStateChange: (state: ChatConnectionState) => void;
  onError: (error: ChatDomainError) => void;
  autoReconnect?: boolean;
  webSocketFactory?: WebSocketFactory;
  setTimer?: TimerFactory;
  clearTimer?: TimerClear;
  baseUrl?: string;
}

export const createChatWebSocketTransport = (
  options: CreateTransportOptions,
): ChatWebSocketTransport => {
  const webSocketFactory =
    options.webSocketFactory ?? ((url: string) => new WebSocket(url));
  const setTimer = options.setTimer ?? window.setTimeout;
  const clearTimer = options.clearTimer ?? window.clearTimeout;

  let socket: WebSocketLike | null = null;
  let reconnectTimer: number | null = null;
  let reconnectAttempt = 0;
  let disposed = false;

  const emitConnectionState = (state: ChatConnectionState) => {
    options.onConnectionStateChange(state);
  };

  const cleanupSocket = () => {
    if (!socket) {
      return;
    }

    socket.onopen = null;
    socket.onmessage = null;
    socket.onclose = null;
    socket.onerror = null;
    socket = null;
  };

  const clearReconnectTimer = () => {
    if (reconnectTimer === null) {
      return;
    }

    clearTimer(reconnectTimer);
    reconnectTimer = null;
  };

  const scheduleReconnect = () => {
    if (!options.autoReconnect || disposed) {
      return;
    }

    clearReconnectTimer();

    reconnectAttempt += 1;
    const backoffMs = computeBackoff(reconnectAttempt);
    emitConnectionState("reconnecting");

    reconnectTimer = setTimer(() => {
      reconnectTimer = null;
      connectInternal();
    }, backoffMs);
  };

  const connectInternal = () => {
    if (disposed) {
      return;
    }

    clearReconnectTimer();
    emitConnectionState(reconnectAttempt > 0 ? "reconnecting" : "connecting");

    try {
      const url = buildWebSocketUrl(options.token, options.baseUrl);
      socket = webSocketFactory(url);

      socket.onopen = () => {
        reconnectAttempt = 0;
        emitConnectionState("connected");
      };

      socket.onmessage = (event) => {
        let parsedJson: unknown;

        try {
          parsedJson = JSON.parse(event.data);
        } catch {
          console.warn("[chat] dropped non-JSON WS message", event.data);
          return;
        }

        const parsedEvent = parseInboundEvent(parsedJson);
        if (!parsedEvent) {
          return;
        }

        options.onEvent(parsedEvent);
      };

      socket.onerror = () => {
        options.onError(
          mapError({
            message: "WebSocket transport encountered an error",
          }),
        );
      };

      socket.onclose = (event) => {
        cleanupSocket();
        const mappedError = mapCloseToError(event);

        if (mappedError) {
          options.onError(mappedError);
        }

        if (mappedError?.kind === "auth") {
          emitConnectionState("auth-failed");
          return;
        }

        emitConnectionState("disconnected");
        scheduleReconnect();
      };
    } catch {
      options.onError(
        mapError({ message: "Unable to create WebSocket connection" }),
      );
      emitConnectionState("disconnected");
      scheduleReconnect();
    }
  };

  const connect = () => {
    disposed = false;
    connectInternal();
  };

  const disconnect = () => {
    disposed = true;
    clearReconnectTimer();

    if (socket) {
      socket.close(1000, "Client disconnected");
    }

    cleanupSocket();
    emitConnectionState("disconnected");
  };

  const send = (payload: ChatSendPayload) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw mapError({ message: "Chat socket is not connected" });
    }

    socket.send(JSON.stringify(payload));
  };

  const reconnect = () => {
    if (socket) {
      socket.close(1000, "Client initiated reconnect");
      cleanupSocket();
    }

    disposed = false;
    reconnectAttempt += 1;
    connectInternal();
  };

  return {
    connect,
    send,
    reconnect,
    disconnect,
  };
};
