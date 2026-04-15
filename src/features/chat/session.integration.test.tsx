// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createChatWebSocketTransport } from "./ws-transport";
import type { ChatConnectionState, ChatInboundEvent } from "./types";

class MockSocket {
  static readonly OPEN = 1;
  static readonly CLOSED = 3;

  readyState = MockSocket.OPEN;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent<string>) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  sendCalls: string[] = [];
  closeCalls: Array<{ code?: number; reason?: string }> = [];

  emitOpen() {
    this.onopen?.(new Event("open"));
  }

  emitMessage(payload: unknown) {
    this.onmessage?.(
      new MessageEvent("message", {
        data: JSON.stringify(payload),
      }) as MessageEvent<string>,
    );
  }

  emitClose(code: number, reason: string) {
    this.readyState = MockSocket.CLOSED;
    this.onclose?.(
      new CloseEvent("close", {
        code,
        reason,
      }),
    );
  }

  close(code?: number, reason?: string) {
    this.readyState = MockSocket.CLOSED;
    this.closeCalls.push({ code, reason });
  }

  send(data: string) {
    this.sendCalls.push(data);
  }
}

describe("chat ws transport integration", () => {
  const sockets: MockSocket[] = [];
  const connectionStates: ChatConnectionState[] = [];
  const events: ChatInboundEvent[] = [];
  const errors: string[] = [];

  beforeEach(() => {
    sockets.length = 0;
    connectionStates.length = 0;
    events.length = 0;
    errors.length = 0;
    vi.useFakeTimers();
    Object.assign(globalThis, {
      WebSocket: {
        OPEN: MockSocket.OPEN,
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createTransport = () =>
    createChatWebSocketTransport({
      token: "mock-token",
      autoReconnect: true,
      webSocketFactory: (_url) => {
        const socket = new MockSocket();
        sockets.push(socket);
        return socket;
      },
      onEvent: (event) => {
        events.push(event);
      },
      onError: (error) => {
        errors.push(error.message);
      },
      onConnectionStateChange: (state) => {
        connectionStates.push(state);
      },
    });

  it("handles conversation.started handshake", () => {
    const transport = createTransport();
    transport.connect();

    expect(connectionStates[0]).toBe("connecting");

    sockets[0]?.emitOpen();
    sockets[0]?.emitMessage({
      type: "conversation.started",
      conversation_id: "conv-1",
    });

    expect(connectionStates).toContain("connected");
    expect(events[0]).toEqual({
      type: "conversation.started",
      conversation_id: "conv-1",
    });
  });

  it("handles assistant.final message cycle and outbound send", () => {
    const transport = createTransport();
    transport.connect();
    sockets[0]?.emitOpen();

    transport.send({ message: "hello", conversation_id: "conv-1" });
    sockets[0]?.emitMessage({
      type: "assistant.final",
      conversation_id: "conv-1",
      user_message: {
        content: "hello",
      },
      assistant_message: {
        content: "world",
        citations: [{ title: "docs" }],
      },
    });

    expect(sockets[0]?.sendCalls).toHaveLength(1);
    expect(events[0]?.type).toBe("assistant.final");

    if (events[0]?.type !== "assistant.final") {
      return;
    }

    expect(events[0].assistant_message.citations?.[0]?.title).toBe("docs");
  });

  it("handles backend error events and reconnect after unexpected close", () => {
    const transport = createTransport();
    transport.connect();
    sockets[0]?.emitOpen();

    sockets[0]?.emitMessage({
      type: "error",
      code: "E_BACKEND",
      message: "backend failure",
      recoverable: true,
    });

    expect(events[0]?.type).toBe("error");

    sockets[0]?.emitClose(1011, "server crashed");
    expect(connectionStates).toContain("disconnected");
    expect(connectionStates).toContain("reconnecting");
    expect(errors).toContain("server crashed");

    vi.advanceTimersByTime(500);
    sockets[1]?.emitOpen();

    expect(sockets.length).toBe(2);
    expect(connectionStates.at(-1)).toBe("connected");
  });
});
