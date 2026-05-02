import { useServerFn } from "@tanstack/react-start";
import { getChatWebSocketConnection } from "../services";
import { useRef } from "react";

export const useChatWebSocket = () => {
  const getSocketConnection = useServerFn(getChatWebSocketConnection);
  const socket = useRef<WebSocket | null>(null);

  const connect = async () => {
    if (socket.current) {
      console.warn("WebSocket is already connected");
      return;
    }
    try {
      const { connection } = await getSocketConnection();
      socket.current = new WebSocket(connection);
      socket.current.onopen = () => {
        console.log("WebSocket connection opened");
      };
      socket.current.onclose = () => {
        console.log("WebSocket connection closed");
        socket.current = null;
      };
      socket.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
    }
  };

  const disconnect = () => {
    if (socket.current) {
      socket.current.close();
      socket.current = null;
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  return {
    socket: socket.current,
    connect,
    disconnect,
  };
};
