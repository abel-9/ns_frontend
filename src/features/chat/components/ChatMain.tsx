import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChat } from "../context/ChatContext";
import ChatMessages from "./ChatMessages";
import { getConversation } from "../services";
import ChatMessageInput from "./ChatMessageinput";
import { useEffect, useRef } from "react";
import { useSSEChat } from "../hooks/useSendChatMessage";
import type { ChatMessageRole } from "../types";

const ChatMain = () => {
  const { filters } = useChat();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["conversation", filters.activeConversationId],
    queryFn: () =>
      getConversation({
        data: { conversationId: filters.activeConversationId! },
      }),
    enabled: !!filters.activeConversationId,
  });

  const messageAreaRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const { send, response, isStreaming, error, stop } = useSSEChat();

  const baseMessages = data?.messages ?? [];

  const messages = isStreaming
    ? [
        ...baseMessages,
        {
          id: "streaming",
          role: "assistant" as ChatMessageRole,
          content: response,
          sources: [],
          created_at: new Date().toISOString(),
        },
      ]
    : baseMessages;

  useEffect(() => {
    const area = messageAreaRef.current;
    if (!area || !shouldAutoScrollRef.current) {
      return;
    }

    area.scrollTop = area.scrollHeight;
  }, [messages, isStreaming]);

  useEffect(() => {
    if (!isStreaming && response) {
      queryClient.invalidateQueries({
        queryKey: ["conversation", filters.activeConversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    }
  }, [isStreaming, response, queryClient, filters.activeConversationId]);
  const handleScroll = () => {
    const area = messageAreaRef.current;
    if (!area) {
      return;
    }

    const remaining = area.scrollHeight - area.scrollTop - area.clientHeight;
    shouldAutoScrollRef.current = remaining < 40;
  };

  const handleSubmit = (prompt: string) => {
    if (!filters.activeConversationId) return;

    const newMessage = {
      id: `temp-${Date.now()}`,
      role: "user" as ChatMessageRole,
      content: prompt,
      created_at: new Date().toISOString(),
    };

    queryClient.setQueryData(
      ["conversation", filters.activeConversationId],
      (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          messages: [...oldData.messages, newMessage],
        };
      },
    );

    send(prompt, filters.activeConversationId);
  };

  if (!filters.activeConversationId) {
    return (
      <main className="h-screen pl-72 bg-primary-foreground overflow-y-auto">
        <div className="h-full flex flex-col justify-center items-center">
          <p className="text-lg font-medium">
            Select a conversation to start chatting!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen pl-72 bg-primary-foreground overflow-y-auto">
      {isLoading && !data ? (
        <p className="p-4 text-center text-gray-500">Loading conversation...</p>
      ) : (
        <div className="h-screen flex flex-col">
          {error ? (
            <div
              role="alert"
              className="mx-6 mt-4 rounded-md border border-red-300 bg-red-50 text-red-700 px-4 py-2 text-sm"
            >
              {error}
            </div>
          ) : null}

          <div
            ref={messageAreaRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto scrollbar"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center">
                <p className="text-lg font-medium">Ready to chat!</p>
              </div>
            ) : (
              <ChatMessages messages={messages} />
            )}
          </div>

          <div className="flex flex-row justify-center pb-3">
            <ChatMessageInput
              onSubmit={handleSubmit}
              onStop={stop}
              disabled={isStreaming}
              showStop={isStreaming}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default ChatMain;
