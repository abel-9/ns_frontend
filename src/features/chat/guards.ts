import { z } from "zod";
import type {
  AssistantFinalEvent,
  ChatCitation,
  ChatErrorEvent,
  ChatInboundEvent,
  ConversationStartedEvent,
} from "./types";

const citationSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().optional(),
    url: z.string().optional(),
    snippet: z.string().optional(),
  })
  .strict();

const conversationStartedSchema = z
  .object({
    type: z.literal("conversation.started"),
    conversation_id: z.string().min(1),
  })
  .strict();

const assistantMessageSchema = z
  .object({
    id: z.string().optional(),
    content: z.string().min(1),
    created_at: z.string().optional(),
    citations: z.array(citationSchema).optional(),
  })
  .strict();

const assistantFinalSchema = z
  .object({
    type: z.literal("assistant.final"),
    conversation_id: z.string().min(1),
    user_message: z
      .object({
        id: z.string().optional(),
        content: z.string().min(1),
        created_at: z.string().optional(),
      })
      .strict(),
    assistant_message: assistantMessageSchema,
  })
  .strict();

const chatErrorSchema = z
  .object({
    type: z.literal("error"),
    code: z.string().min(1),
    message: z.string().min(1),
    recoverable: z.boolean().optional(),
  })
  .strict();

const inboundEventSchema = z.union([
  conversationStartedSchema,
  assistantFinalSchema,
  chatErrorSchema,
]);

export const isConversationStartedEvent = (
  value: unknown,
): value is ConversationStartedEvent =>
  conversationStartedSchema.safeParse(value).success;

export const isAssistantFinalEvent = (
  value: unknown,
): value is AssistantFinalEvent =>
  assistantFinalSchema.safeParse(value).success;

export const isErrorEvent = (value: unknown): value is ChatErrorEvent =>
  chatErrorSchema.safeParse(value).success;

const normalizeCitation = (value: unknown): ChatCitation | null => {
  const parsed = citationSchema.safeParse(value);
  if (!parsed.success) {
    return null;
  }

  return parsed.data;
};

const normalizeAssistantFinalEvent = (
  raw: unknown,
): AssistantFinalEvent | null => {
  if (isAssistantFinalEvent(raw)) {
    return raw;
  }

  if (!raw || typeof raw !== "object") {
    return null;
  }

  const source = raw as Record<string, unknown>;

  if (source.type !== "assistant.final") {
    return null;
  }

  const userMessage = source.user_message ?? source.userMessage;
  const assistantMessage = source.assistant_message ?? source.assistantMessage;
  const conversationId = source.conversation_id ?? source.conversationId;

  if (!userMessage || !assistantMessage || typeof conversationId !== "string") {
    return null;
  }

  if (typeof userMessage !== "object" || typeof assistantMessage !== "object") {
    return null;
  }

  const assistantMessageObject = assistantMessage as Record<string, unknown>;
  const citations = Array.isArray(assistantMessageObject.citations)
    ? assistantMessageObject.citations
        .map((citation) => normalizeCitation(citation))
        .filter((citation): citation is ChatCitation => Boolean(citation))
    : undefined;

  const normalized = {
    type: "assistant.final" as const,
    conversation_id: conversationId,
    user_message: {
      id:
        typeof (userMessage as Record<string, unknown>).id === "string"
          ? ((userMessage as Record<string, unknown>).id as string)
          : undefined,
      content: (userMessage as Record<string, unknown>).content,
      created_at:
        typeof (userMessage as Record<string, unknown>).created_at === "string"
          ? ((userMessage as Record<string, unknown>).created_at as string)
          : typeof (userMessage as Record<string, unknown>).createdAt ===
              "string"
            ? ((userMessage as Record<string, unknown>).createdAt as string)
            : undefined,
    },
    assistant_message: {
      id:
        typeof assistantMessageObject.id === "string"
          ? (assistantMessageObject.id as string)
          : undefined,
      content: assistantMessageObject.content,
      created_at:
        typeof assistantMessageObject.created_at === "string"
          ? (assistantMessageObject.created_at as string)
          : typeof assistantMessageObject.createdAt === "string"
            ? (assistantMessageObject.createdAt as string)
            : undefined,
      citations,
    },
  };

  const parsed = assistantFinalSchema.safeParse(normalized);
  return parsed.success ? parsed.data : null;
};

export const parseInboundEvent = (raw: unknown): ChatInboundEvent | null => {
  const direct = inboundEventSchema.safeParse(raw);
  if (direct.success) {
    return direct.data;
  }

  const normalizedAssistantFinal = normalizeAssistantFinalEvent(raw);
  if (normalizedAssistantFinal) {
    return normalizedAssistantFinal;
  }

  console.warn("[chat] dropped malformed or unsupported event", raw);
  return null;
};
