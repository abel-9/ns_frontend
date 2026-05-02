import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ServerEvent =
  | { type: "token"; value: string }
  | { type: "done" }
  | { type: "error"; message: string };

type SocketChatProps = {
  conversationId: string;
  apiBaseUrl?: string; // Example: http://localhost:8000
};

export const Route = createFileRoute("/chat2")({
  component: ChatComponent,
});

function ChatComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const activeAssistantIndexRef = useRef<number | null>(null);

  const wsUrl = useMemo(() => {
    const http = new URL("http://localhost:8000/api/v1"); // Default API base URL
    const protocol = http.protocol === "https:" ? "wss:" : "ws:";
    return `ws://localhost:8000/api/v1/conversations/54382e7e-560f-449b-b657-065e01f0494b/messages/ws`;
  }, []);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsStreaming(false);
      activeAssistantIndexRef.current = null;
    };

    ws.onerror = () => {
      setError("WebSocket connection error");
    };

    ws.onmessage = (event) => {
      try {
        const data: ServerEvent = JSON.parse(event.data);

        if (data.type === "token") {
          setIsStreaming(true);
          setMessages((prev) => {
            const idx = activeAssistantIndexRef.current;
            if (idx === null || idx >= prev.length) {
              return prev;
            }
            const next = [...prev];
            next[idx] = {
              ...next[idx],
              content: next[idx].content + data.value,
            };
            return next;
          });
        }

        if (data.type === "done") {
          setIsStreaming(false);
          activeAssistantIndexRef.current = null;
        }

        if (data.type === "error") {
          setError(data.message);
          setIsStreaming(false);
          activeAssistantIndexRef.current = null;
        }
      } catch {
        setError("Invalid message from server");
      }
    };

    return () => {
      ws.close();
    };
  }, [wsUrl]);

  const sendMessage = () => {
    const ws = wsRef.current;
    const content = input.trim();

    if (!ws || ws.readyState !== WebSocket.OPEN || !content || isStreaming) {
      return;
    }

    setError(null);

    setMessages((prev: any) => {
      const next = [
        ...prev,
        { role: "user", content },
        { role: "assistant", content: "" },
      ];
      activeAssistantIndexRef.current = next.length - 1;
      return next;
    });

    ws.send(JSON.stringify({ content }));
    setInput("");
  };

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "1rem" }}>
      <h2>Socket Chat</h2>
      <p>
        Status: {isConnected ? "connected" : "disconnected"}
        {isStreaming ? " | streaming" : ""}
      </p>

      {error && (
        <div style={{ color: "#b91c1c", marginBottom: "0.75rem" }}>{error}</div>
      )}

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "1rem",
          minHeight: 240,
          marginBottom: "0.75rem",
          overflowY: "auto",
          background: "#fafafa",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "0.5rem" }}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          style={{ flex: 1, padding: "0.5rem" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || isStreaming || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
