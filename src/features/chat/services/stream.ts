import { API_VERSION } from "#/const";
import type { SendMessageInput, StreamEvent } from "../types";
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
  const apiPath = `/api/${API_VERSION}/conversations/${input.conversationId}/messages`;

  const response = await fetch(apiPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ content: input.content }),
    signal: input.signal,
    credentials: "include",
  });

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
      if (done) {
        buffer += decoder.decode();
        const parsed = parseSSEFrames(buffer);
        buffer = parsed.rest;

        for (const event of parsed.events) {
          callbacks.onEvent(event);
          if (event.type === "done") {
            return;
          }
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const parsed = parseSSEFrames(buffer);
      buffer = parsed.rest;

      for (const event of parsed.events) {
        callbacks.onEvent(event);
        if (event.type === "done") {
          return;
        }
      }
    }
  } finally {
    callbacks.onClose?.();
    reader.releaseLock();
  }
}
