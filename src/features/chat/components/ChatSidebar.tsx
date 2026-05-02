import ChatConversationList from "./ChatConversationList";
import ChatSidebarFooter from "./ChatSidebarFooter";
import ChatSidebarHeader from "./ChatSidebarHeader";
import ChatSidebarSearch from "./ChatSidebarSearch";

export default function ChatSidebar() {
  return (
    <aside className="absolute left-0 top-0 h-full w-72 bg-gray-200 flex flex-col border-r border-gray-300">
      <ChatSidebarHeader />
      <ChatSidebarSearch />
      <ChatConversationList />
      <ChatSidebarFooter />
    </aside>
  );
}
