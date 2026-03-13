import { ArrowUp, SquareArrowOutUpRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useNavigate } from "@tanstack/react-router";

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
  const [isReplying, setIsReplying] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const navigator = useNavigate();

  const canSend = useMemo(
    () => input.trim().length > 0 && !isReplying,
    [input, isReplying],
  );

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (!listRef.current) return;
      listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  };

  const askAI = (prompt: string) => {
    const userMsg = createMessage("user", prompt);
    const assistantMsg = createMessage("assistant", "");

    // 1. Update UI: Add user message and the empty assistant bubble
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    scrollToBottom();

    // 2. Prepare payload: Send ONLY previous history + the NEW user message
    // IMPORTANT: Do NOT send the empty assistant message to Groq!
    const apiPayload = [...messages, userMsg].map(({ role, content }) => ({
      role,
      content: String(content).trim(), // Ensure it's a non-empty string
    }));

    const encodedHistory = encodeURIComponent(JSON.stringify(apiPayload));
    const eventSource = new EventSource(
      `http://localhost:8000/api/v1/chat?history=${encodedHistory}`,
    );
    eventSourceRef.current = eventSource;

    setIsReplying(true);

    eventSource.onmessage = (event) => {
      // 3. Update the VERY LAST message in the array (the assistant one)
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex].role === "assistant") {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: updated[lastIndex].content + event.data,
          };
        }
        return updated;
      });
      scrollToBottom();
    };

    eventSource.onerror = () => {
      eventSource.close();
      eventSourceRef.current = null;
      setIsReplying(false);
    };
  };

  const resetChat = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setIsReplying(false);
    setInput("");
    setMessages(createInitialMessages());
  };

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, []);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const prompt = input.trim();
    if (!prompt || isReplying) return;
    askAI(prompt);
    setInput("");
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
            {messages.map((message) => {
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
        </div>
      </div>
    </section>
  );
};

export default Chat;
