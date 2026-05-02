import ChatConversationItem from "./ChatConversationItem";
import { useChat } from "../context/ChatContext";
import type { ChatConversation } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getConversations } from "../services";

export default function ChatConversationList() {
  const { filters, setFilters } = useChat();
  const { data } = useQuery<ChatConversation[]>({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  const conversations = data ?? [];

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {conversations.length === 0 ? (
        <p className="px-2 py-3 text-sm text-gray-500">
          No conversations found.
        </p>
      ) : null}

      {conversations.map((conversation) => {
        if (conversation.messages.length === 0) return null;
        return (
          <div
            key={conversation.id}
            className="border-b border-b-secondary-foreground/20"
          >
            <ChatConversationItem
              conversation={conversation}
              isActive={filters.activeConversationId === conversation.id}
              onClick={(id) => {
                setFilters((prev) => ({ ...prev, activeConversationId: id }));
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
