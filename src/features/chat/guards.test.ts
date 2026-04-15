import { describe, expect, it, vi } from "vitest";
import {
  isAssistantFinalEvent,
  isConversationStartedEvent,
  isErrorEvent,
  parseInboundEvent,
} from "./guards";

describe("chat inbound guards", () => {
  it("parses strict conversation.started payload", () => {
    const event = parseInboundEvent({
      type: "conversation.started",
      conversation_id: "conv-1",
    });

    expect(isConversationStartedEvent(event)).toBe(true);
    expect(event?.type).toBe("conversation.started");
  });

  it("normalizes assistant.final camelCase payload", () => {
    const event = parseInboundEvent({
      type: "assistant.final",
      conversationId: "conv-2",
      userMessage: {
        content: "hello",
        createdAt: "2026-04-15T10:00:00Z",
      },
      assistantMessage: {
        content: "hi",
        createdAt: "2026-04-15T10:00:01Z",
        citations: [{ title: "Doc" }],
      },
    });

    expect(isAssistantFinalEvent(event)).toBe(true);
    expect(event?.type).toBe("assistant.final");
    if (event?.type !== "assistant.final") {
      return;
    }

    expect(event.conversation_id).toBe("conv-2");
    expect(event.assistant_message.citations?.[0]?.title).toBe("Doc");
  });

  it("accepts valid backend error payload", () => {
    const event = parseInboundEvent({
      type: "error",
      code: "E_BACKEND",
      message: "backend failure",
      recoverable: true,
    });

    expect(isErrorEvent(event)).toBe(true);
  });

  it("drops malformed event payloads", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const event = parseInboundEvent({
      type: "assistant.final",
      conversation_id: "conv-3",
      user_message: { content: "user" },
      assistant_message: { content: 123 },
    });

    expect(event).toBeNull();
    expect(warn).toHaveBeenCalledOnce();
  });
});
