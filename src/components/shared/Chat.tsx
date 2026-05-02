import { ArrowUp, SquareArrowOutUpRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useNavigate } from "@tanstack/react-router";
import { useSSEChat } from "#/features/chat/hooks/useSendChatMessage";
import { useChat } from "#/features/chat/context/ChatContext";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const createMessage = (role: Message["role"], content: string): Message => ({
  id: crypto.randomUUID(),
  role,
  content,
  timestamp: new Date(),
});

const createInitialMessages = (): Message[] => [
  createMessage("assistant", "Hello! How can I assist you today?"),
];

interface ChatProps {
  onclose: () => void;
}

const Chat: React.FC<ChatProps> = ({ onclose }) => {
  const [messages, setMessages] = useState<Message[]>(createInitialMessages);
  const [input, setInput] = useState("");
  const { filters } = useChat();

  const listRef = useRef<HTMLDivElement>(null);
  const navigator = useNavigate();

  // ✅ NEW: use shared streaming hook
  const { send, response, isStreaming, error, stop } = useSSEChat();

  const canSend = useMemo(
    () => input.trim().length > 0 && !isStreaming,
    [input, isStreaming],
  );

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (!listRef.current) return;
      listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  };

  // ✅ append streaming assistant message dynamically
  const derivedMessages = isStreaming
    ? [
        ...messages,
        {
          id: "streaming",
          role: "assistant" as const,
          content: response,
          timestamp: new Date(),
        },
      ]
    : messages;

  // ✅ auto scroll
  useEffect(() => {
    scrollToBottom();
  }, [derivedMessages, isStreaming]);

  // ✅ when stream finishes, persist assistant message
  useEffect(() => {
    if (!isStreaming && response) {
      setMessages((prev) => [...prev, createMessage("assistant", response)]);
    }
  }, [isStreaming, response]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const prompt = input.trim();
    if (!prompt || isStreaming) return;

    // ✅ optimistic user message
    setMessages((prev) => [...prev, createMessage("user", prompt)]);

    // ✅ trigger streaming
    send(prompt, filters.activeConversationId!);

    setInput("");
  };

  const resetChat = () => {
    stop();
    setInput("");
    setMessages(createInitialMessages());
  };

  return (
    <section className="overflow-hidden rounded-2xl p-2 border border-border bg-bg-light/95 shadow-xl backdrop-blur-sm">
      <div className="justify-between mb-2 flex items-center">
        <h2 className="text-sm font-medium">Chat Support</h2>
        <div className="flex items-center">
          <Button variant="ghost" onClick={resetChat}>
            clear chat
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  onclose();
                  navigator({ to: "/chat" });
                }}
              >
                <SquareArrowOutUpRight />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open Chat Dashboard</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="h-96">
        <div className="flex h-full w-full flex-col rounded-3xl border border-border bg-background">
          <div
            ref={listRef}
            className="scrollbar flex-1 space-y-3 overflow-y-auto p-3 overflow-hidden"
          >
            {derivedMessages.map((message) => {
              const isUser = message.role === "user";

              return (
                <article
                  key={message.id}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    isUser
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "mr-auto bg-muted text-foreground"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                  <p
                    className={`mt-1 text-[10px] ${
                      isUser
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {` • ${message.role === "user" ? "You" : "Assistant"}`}
                  </p>
                </article>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              className="h-10 flex-1 rounded-full border border-input px-3 bg-background text-sm outline-none ring-0 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <Button size={"icon"} type="submit" disabled={!canSend}>
              <ArrowUp />
            </Button>
          </form>

          {error && (
            <div className="px-3 pb-2 text-xs text-red-500">{error}</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Chat;
