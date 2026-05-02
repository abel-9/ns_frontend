import { useEffect, useRef, useState, useCallback } from "react";

interface SSEMessage {
  type: "token" | "done" | "error";
  value?: string;
}

export function useSSEChat() {
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  const stop = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setIsStreaming(false);
  }, []);

  const send = useCallback(
    (prompt: string, conversationId: string) => {
      if (!prompt || !conversationId) return;

      // Reset state
      setResponse("");
      setError(null);

      // Close previous stream if exists
      stop();

      const url = `http://localhost:8000/api/v1/conversations/${conversationId}/messages?prompt=${encodeURIComponent(prompt)}`;

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;
      setIsStreaming(true);

      eventSource.onmessage = (event) => {
        try {
          const parsed: SSEMessage = JSON.parse(event.data);

          switch (parsed.type) {
            case "token":
              setResponse((prev) => prev + (parsed.value || ""));
              break;

            case "done":
              stop();
              break;

            case "error":
              setError(parsed.value || "Unknown error");
              stop();
              break;
          }
        } catch (err) {
          console.error("Parse error:", err);
          setError("Invalid server response");
          stop();
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        setError("Connection error");
        stop();
      };
    },
    [stop],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    send,
    response,
    isStreaming,
    error,
    stop,
  };
}
