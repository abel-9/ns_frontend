import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "../types";
import SourcesList from "./SourcesList";

type ChatMessageItemProps = {
  message: ChatMessage;
};

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "2-digit",
  minute: "2-digit",
});

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex flex-col max-w-[min(80%,46rem)]">
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? "bg-black text-white rounded-br-sm"
              : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
          }`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content ?? ""}
          </ReactMarkdown>

          <p
            className={`mt-1 text-[11px] ${
              isUser ? "text-gray-200" : "text-gray-500"
            }`}
          >
            {timeFormatter.format(new Date(message.created_at))}
          </p>
        </div>

        {message.sources?.length ? (
          <SourcesList sources={message.sources} />
        ) : null}
      </div>
    </div>
  );
}
