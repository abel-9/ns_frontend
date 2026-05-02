import { createContext, useContext, useEffect, useState } from "react";
import type { ChatFilters } from "../types";
import { useCreateConversation } from "../hooks/useCreateConversation";

interface ChatContextValue {
  filters: ChatFilters;
  setFilters: React.Dispatch<React.SetStateAction<ChatFilters>>;
}

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const ChatProvider = ({ children }: ChatProviderProps) => {
  const [filters, setFilters] = useState<ChatFilters>({
    search: "",
    activeConversationId: null,
  });

  const { isPending, isError, conversation_id, mutate } =
    useCreateConversation();

  useEffect(() => {
    if (!conversation_id) {
      mutate({});
    }
  }, [mutate, conversation_id]);

  useEffect(() => {
    if (conversation_id) {
      setFilters((prev) => ({
        ...prev,
        activeConversationId: conversation_id,
      }));
    }
  }, [conversation_id]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error creating conversation</div>;
  }

  if (!conversation_id) {
    return null;
  }

  return (
    <ChatContext.Provider
      value={{
        filters,
        setFilters,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export { ChatProvider, useChat };
