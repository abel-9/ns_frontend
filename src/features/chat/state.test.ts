import { describe, expect, it } from "vitest";
import {
  chatSessionReducer,
  initialChatSessionState,
  shouldBlockDuplicateSend,
} from "./state";

describe("chat session reducer", () => {
  it("transitions connection state", () => {
    const next = chatSessionReducer(initialChatSessionState, {
      type: "connection.changed",
      connection: "connected",
    });

    expect(next.connection).toBe("connected");
  });

  it("hydrates history and marks ready", () => {
    const next = chatSessionReducer(initialChatSessionState, {
      type: "history.hydrated",
      payload: {
        conversation_id: "conv-history",
        messages: [
          {
            id: "m1",
            role: "assistant",
            content: "hello",
            createdAt: "2026-04-15T09:00:00Z",
          },
        ],
      },
    });

    expect(next.ready).toBe(true);
    expect(next.timeline).toHaveLength(1);
    expect(next.conversationId).toBe("conv-history");
  });

  it("appends user and assistant messages on assistant.final", () => {
    const next = chatSessionReducer(initialChatSessionState, {
      type: "assistant.final",
      payload: {
        type: "assistant.final",
        conversation_id: "conv-final",
        user_message: { content: "question" },
        assistant_message: {
          content: "answer",
          citations: [{ title: "Source" }],
        },
      },
    });

    expect(next.timeline).toHaveLength(2);
    expect(next.timeline[0]?.role).toBe("user");
    expect(next.timeline[1]?.role).toBe("assistant");
    expect(next.timeline[1]?.citations?.[0]?.title).toBe("Source");
  });

  it("tracks pending state for send lifecycle", () => {
    const started = chatSessionReducer(initialChatSessionState, {
      type: "send.started",
      at: 1000,
    });

    expect(started.pendingSend).toBe(true);

    const completed = chatSessionReducer(started, {
      type: "send.completed",
    });

    expect(completed.pendingSend).toBe(false);
  });
});

describe("duplicate send guard", () => {
  it("blocks while pending send is true", () => {
    const blocked = shouldBlockDuplicateSend(
      {
        ...initialChatSessionState,
        pendingSend: true,
      },
      Date.now(),
    );

    expect(blocked).toBe(true);
  });

  it("blocks short debounce window", () => {
    const blocked = shouldBlockDuplicateSend(
      {
        ...initialChatSessionState,
        lastSendAt: 1000,
      },
      1200,
    );

    expect(blocked).toBe(true);
  });

  it("allows send after debounce window", () => {
    const blocked = shouldBlockDuplicateSend(
      {
        ...initialChatSessionState,
        lastSendAt: 1000,
      },
      1400,
    );

    expect(blocked).toBe(false);
  });
});
