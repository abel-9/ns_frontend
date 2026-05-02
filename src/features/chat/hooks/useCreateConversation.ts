import { useMutation } from "@tanstack/react-query";
import { createConversation } from "../services";

export const useCreateConversation = () => {
  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: createConversation,
    onError: (error) => {
      console.error("Error creating conversation:", error);
    },
    onSuccess: (data) => {
      console.log("Conversation created successfully:", data);
    },
  });

  return {
    conversation_id: data?.conversation_id,
    mutate,
    isPending,
    isError,
    error,
  };
};
