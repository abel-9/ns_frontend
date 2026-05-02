import type { ChatMessage } from "../types";
import ChatMessageItem from "./ChatMessageItem";

type ChatMessagesProps = {
  messages: ChatMessage[];
};

export default function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <section className="px-6 py-5 space-y-3">
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
    </section>
  );
}
