import type { ChatConversation } from "../types";

type ChatConversationItemProps = {
  conversation: ChatConversation;
  isActive: boolean;
  onClick: (conversationId: string) => void;
};

export default function ChatConversationItem({
  conversation,
  isActive,
  onClick,
}: ChatConversationItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(conversation.id)}
      className={`w-full text-left px-3 py-2 rounded-lg transition flex flex-col ${
        isActive ? "bg-white shadow-sm" : "hover:bg-gray-300"
      }`}
    >
      <span className="text-sm font-medium truncate">
        {conversation.title
          ? conversation.title.length > 30
            ? conversation.title.substring(0, 30) + "..."
            : conversation.title
          : "New conversation"}
      </span>
      {/* <span className="text-xs text-gray-500">
        {conversation.messages.length} messages
      </span> */}
    </button>
  );
}
