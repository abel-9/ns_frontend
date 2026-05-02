import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/chat3")({
  component: ChatComponent,
});

function ChatComponent() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);

  const startStream = () => {
    if (!prompt) return;

    // Close any existing stream
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setResponse("");

    const url = `http://localhost:8000/api/v1/conversations/68f487ca-f73c-4299-9c19-bf8c97047bb5/messages?prompt=${encodeURIComponent(
      prompt,
    )}`;

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = event.data;
      const parsed = JSON.parse(data);

      if (parsed.type === "done") {
        eventSource.close();
        return;
      }

      if (parsed.type === "token") {
        setResponse((prev) => prev + parsed.value);
        return;
      }

      if (parsed.type === "error") {
        console.error(parsed.value);
        eventSource.close();
        return;
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Streaming Chat</h2>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask something..."
        style={{ width: "100%", padding: 8 }}
      />

      <button
        onClick={startStream}
        style={{ marginTop: 10, padding: "8px 16px" }}
      >
        Send
      </button>

      <div
        style={{
          marginTop: 20,
          padding: 10,
          border: "1px solid #ccc",
          minHeight: 100,
          whiteSpace: "pre-wrap",
        }}
      >
        {response}
      </div>
    </div>
  );
}
