import ChatMain from "#/features/chat/components/ChatMain";
import ChatSidebar from "#/features/chat/components/ChatSidebar";
import { ChatProvider } from "#/features/chat/context/ChatContext";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ChatProvider>
      <div className="relative h-screen">
        <ChatSidebar />
        <ChatMain />
      </div>
    </ChatProvider>
  );
}
