import { API_BASE_URL } from "#/const";
import type {
  ChatDomainError,
  ChatHistoryResponse,
  ChatMessage,
  ChatCitation,
} from "./types";

type FetchLike = typeof fetch;

const normalizeCitations = (value: unknown): ChatCitation[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const citations = value
    .map((citation): ChatCitation | null => {
      if (!citation || typeof citation !== "object") {
        return null;
      }

      const data = citation as Record<string, unknown>;

      return {
        id: typeof data.id === "string" ? data.id : undefined,
        title: typeof data.title === "string" ? data.title : undefined,
        url: typeof data.url === "string" ? data.url : undefined,
        snippet: typeof data.snippet === "string" ? data.snippet : undefined,
      };
    })
    .filter((citation): citation is ChatCitation => Boolean(citation));

  return citations.length ? citations : undefined;
};

const normalizeMessage = (value: unknown): ChatMessage | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;
  const role = raw.role;
  const content = raw.content;

  if (
    (role !== "user" && role !== "assistant") ||
    typeof content !== "string"
  ) {
    return null;
  }

  const id =
    typeof raw.id === "string" && raw.id.length ? raw.id : crypto.randomUUID();

  const createdAt =
    typeof raw.created_at === "string"
      ? raw.created_at
      : typeof raw.createdAt === "string"
        ? raw.createdAt
        : new Date().toISOString();

  return {
    id,
    role,
    content,
    createdAt,
    citations: normalizeCitations(raw.citations),
  };
};

export const normalizeHistoryResponse = (
  data: unknown,
): ChatHistoryResponse => {
  if (!data || typeof data !== "object") {
    throw mapError({ status: 500, message: "Malformed history response" });
  }

  const payload = data as Record<string, unknown>;
  const conversationId =
    typeof payload.conversation_id === "string"
      ? payload.conversation_id
      : typeof payload.conversationId === "string"
        ? payload.conversationId
        : null;

  const rawMessages = Array.isArray(payload.messages) ? payload.messages : [];
  const messages = rawMessages
    .map((message) => normalizeMessage(message))
    .filter((message): message is ChatMessage => Boolean(message));

  if (!conversationId) {
    throw mapError({
      status: 500,
      message: "Missing conversation_id in history",
    });
  }

  return {
    conversation_id: conversationId,
    messages,
  };
};

export const mapError = ({
  status,
  message,
  code,
}: {
  status?: number;
  message?: string;
  code?: string;
}): ChatDomainError => {
  const normalizedMessage = message ?? "Unexpected chat API error";

  if (status === 401 || status === 403) {
    return {
      kind: "auth",
      status,
      message: normalizedMessage,
      recoverable: false,
      code,
    };
  }

  if (status === 404) {
    return {
      kind: "not_found",
      status,
      message: normalizedMessage,
      recoverable: true,
      code,
    };
  }

  if (typeof status === "number" && status >= 500) {
    return {
      kind: "server",
      status,
      message: normalizedMessage,
      recoverable: true,
      code,
    };
  }

  if (typeof status === "number") {
    return {
      kind: "unknown",
      status,
      message: normalizedMessage,
      recoverable: true,
      code,
    };
  }

  return {
    kind: "network",
    message: normalizedMessage,
    recoverable: true,
    code,
  };
};

export const createChatHistoryClient = (
  fetchImpl: FetchLike = fetch,
  baseUrl: string = API_BASE_URL,
) => {
  const getConversationHistory = async (
    conversationId: string,
    token: string,
  ): Promise<ChatHistoryResponse> => {
    const encodedConversationId = encodeURIComponent(conversationId);
    const response = await fetchImpl(
      `${baseUrl}/chat/conversations/${encodedConversationId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      let message = `Failed to fetch conversation history (${response.status})`;
      let code: string | undefined;

      try {
        const errorPayload = (await response.json()) as Record<string, unknown>;
        if (typeof errorPayload.message === "string") {
          message = errorPayload.message;
        }
        if (typeof errorPayload.code === "string") {
          code = errorPayload.code;
        }
      } catch {
        // Ignore non-JSON responses.
      }

      throw mapError({ status: response.status, message, code });
    }

    const payload = (await response.json()) as unknown;
    return normalizeHistoryResponse(payload);
  };

  return {
    getConversationHistory,
  };
};
