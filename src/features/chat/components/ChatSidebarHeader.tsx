import { Plus } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useCreateConversation } from "../hooks/useCreateConversation";
import { useEffect } from "react";

export default function ChatSidebarHeader() {
  const { setFilters } = useChat();
  const { mutate, conversation_id } = useCreateConversation();

  useEffect(() => {
    if (conversation_id) {
      setFilters((prev) => ({
        ...prev,
        activeConversationId: conversation_id,
      }));
    }
  }, [conversation_id, setFilters]);

  const handleNewConversation = () => {
    mutate({});
  };

  return (
    <div className="p-4 border-b border-gray-300 flex items-center justify-between">
      <h1 className="text-lg font-semibold">ChatBot</h1>
      <button
        type="button"
        className="p-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
        onClick={handleNewConversation}
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
