import { api } from "#/lib/api";
import { authMiddleware } from "#/middlewares";
import { createServerFn } from "@tanstack/react-start";
import type { ChatConversation, ChatConversationDetail } from "../types";
import z from "zod";

export const createConversation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const response = await api.post(
      "/conversations",
      {},
      {
        headers: {
          Authorization: `Bearer ${context.accessToken}`,
        },
      },
    );

    return response.data as { conversation_id: string };
  });

export const getConversations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const response = await api.get("/conversations", {
      headers: {
        Authorization: `Bearer ${context.accessToken}`,
      },
    });

    return response.data as ChatConversation[];
  });

export const getConversation = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      conversationId: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    const { conversationId } = data;
    const response = await api.get(`/conversations/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${context.accessToken}`,
      },
    });

    return response.data as ChatConversationDetail;
  });
