import type { StreamEvent } from "../types";

export function parseSSEFrames(buffer: string): {
  events: StreamEvent[];
  rest: string;
} {
  // Normalize line endings so both LF and CRLF SSE frames are parsed.
  const normalized = buffer.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const events: StreamEvent[] = [];
  const frames = normalized.split("\n\n");
  const rest = frames.pop() ?? "";

  for (const frame of frames) {
    const lines = frame.split("\n");
    let dataLine = "";

    for (const line of lines) {
      if (line.startsWith("data:")) {
        dataLine = line.slice(5).trim();
      }
    }

    if (!dataLine) {
      continue;
    }

    try {
      const parsed = JSON.parse(dataLine) as StreamEvent;
      if (parsed && typeof parsed.type === "string") {
        events.push(parsed);
      }
    } catch {
      // Keep stream alive on malformed chunks.
    }
  }

  return { events, rest };
}
