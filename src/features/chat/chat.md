# Frontend Guide: Handle Chat SSE Stream (Without Token)

## Goal

Consume the backend chat stream from:

- POST /conversations/{conversation_id}/messages
- Response: text/event-stream
- Events:
  - event: token, data: {"type":"token","value":"..."}
  - event: done, data: {"type":"done"}
  - event: error, data: {"type":"error","message":"..."}

This guide intentionally excludes token management on the frontend.

## Assumptions

- Auth is handled outside the client code path (for example: same-origin cookie session, gateway, or backend middleware).
- Frontend only sends message content and conversation id.
- React + TypeScript.

## Recommended Frontend Structure

```text
src/
  features/chat/
    api/
      chat.stream.ts
      chat.types.ts
    utils/
      sseParser.ts
    hooks/
      useSendMessageStream.ts
    components/
      Composer.tsx
      MessageList.tsx
      ChatPanel.tsx
```

## 1) Define Stream Types

Create src/features/chat/api/chat.types.ts

```ts
export type TokenEvent = { type: "token"; value: string };
export type DoneEvent = { type: "done" };
export type ErrorEvent = { type: "error"; message: string };

export type StreamEvent = TokenEvent | DoneEvent | ErrorEvent;

export type SendMessageInput = {
  conversationId: string;
  content: string;
  signal?: AbortSignal;
};
```

## 2) Create an SSE Parser

Create src/features/chat/utils/sseParser.ts

```ts
import type { StreamEvent } from "../api/chat.types";

export function parseSSEFrames(buffer: string): {
  events: StreamEvent[];
  rest: string;
} {
  const events: StreamEvent[] = [];
  const frames = buffer.split("\n\n");
  const rest = frames.pop() ?? "";

  for (const frame of frames) {
    const lines = frame.split("\n");
    let dataLine = "";

    for (const line of lines) {
      if (line.startsWith("data:")) {
        dataLine = line.slice(5).trim();
      }
    }

    if (!dataLine) continue;

    try {
      const parsed = JSON.parse(dataLine) as StreamEvent;
      if (parsed && typeof parsed.type === "string") {
        events.push(parsed);
      }
    } catch {
      // Ignore malformed frames and keep stream alive.
    }
  }

  return { events, rest };
}
```

## 3) Streaming API Function (No Token)

Create src/features/chat/api/chat.stream.ts

```ts
import type { SendMessageInput, StreamEvent } from "./chat.types";
import { parseSSEFrames } from "../utils/sseParser";

type SendMessageCallbacks = {
  onEvent: (event: StreamEvent) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onHttpError?: (status: number, body: string) => void;
};

export async function sendMessageStream(
  input: SendMessageInput,
  callbacks: SendMessageCallbacks,
): Promise<void> {
  const response = await fetch(
    `/conversations/${input.conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ content: input.content }),
      signal: input.signal,
      credentials: "include", // cookie/session-based auth path
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    callbacks.onHttpError?.(response.status, body);
    throw new Error(`Request failed: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Missing response body");
  }

  callbacks.onOpen?.();

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const parsed = parseSSEFrames(buffer);
      buffer = parsed.rest;

      for (const event of parsed.events) {
        callbacks.onEvent(event);
        if (event.type === "done") return;
      }
    }
  } finally {
    callbacks.onClose?.();
    reader.releaseLock();
  }
}
```

## 4) Hook for Streaming State

Create src/features/chat/hooks/useSendMessageStream.ts

```ts
import { useRef, useState } from "react";
import { sendMessageStream } from "../api/chat.stream";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
};

export function useSendMessageStream(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function send(content: string) {
    const text = content.trim();
    if (!text || isStreaming) return;

    setError(null);
    setIsStreaming(true);

    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: text },
      { id: assistantId, role: "assistant", content: "", pending: true },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await sendMessageStream(
        { conversationId, content: text, signal: controller.signal },
        {
          onEvent: (event) => {
            if (event.type === "token") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + event.value }
                    : m,
                ),
              );
              return;
            }

            if (event.type === "done") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, pending: false } : m,
                ),
              );
              return;
            }

            if (event.type === "error") {
              setError(event.message || "Streaming failed");
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, pending: false } : m,
                ),
              );
            }
          },
          onHttpError: (status) => {
            setError(`Request failed (${status})`);
          },
        },
      );
    } catch (e) {
      const aborted = controller.signal.aborted;
      if (!aborted) {
        setError(e instanceof Error ? e.message : "Unknown stream error");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, pending: false } : m,
          ),
        );
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  return {
    messages,
    isStreaming,
    error,
    send,
    stop,
  };
}
```

## 5) Component Wiring

ChatPanel should:

- Render MessageList from hook messages
- Submit from Composer into send(content)
- Show Stop button while isStreaming
- Display error banner when error is not null

Minimal usage:

```tsx
function ChatPanel({ conversationId }: { conversationId: string }) {
  const { messages, isStreaming, error, send, stop } =
    useSendMessageStream(conversationId);

  return (
    <div>
      {error ? <div role="alert">{error}</div> : null}
      <MessageList messages={messages} />
      <Composer
        disabled={isStreaming}
        onSubmit={send}
        onStop={stop}
        showStop={isStreaming}
      />
    </div>
  );
}
```

## 6) UX Rules

- Disable send when input is empty after trim.
- Keep partial assistant text if user presses stop.
- Auto-scroll to bottom while streaming unless user scrolled up.
- Prevent duplicate submits while isStreaming = true.

## 7) Error Mapping

Suggested user-facing messages:

- 400/422: Invalid message input.
- 404: Conversation not found.
- 5xx: Temporary server issue. Try again.
- Stream error event: Show provided message, keep already rendered partial output.

## 8) Why fetch stream instead of EventSource

- This endpoint uses POST.
- EventSource only supports GET.
- fetch + ReadableStream works with POST and cookie/session auth.

## 9) Quick Verification Checklist

- Streaming response starts immediately after submit.
- token events append progressively.
- done marks assistant message as complete.
- stop aborts in-flight request.
- reconnect/new send works after stop/error.
- no token code exists in this frontend path.
