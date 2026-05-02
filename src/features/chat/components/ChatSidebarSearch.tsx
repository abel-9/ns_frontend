import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";

export default function ChatSidebarSearch() {
  const { setFilters } = useChat();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, [value, setFilters]);

  return (
    <div className="p-3 border-b border-gray-300">
      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
        <Search size={16} className="text-gray-500" />
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search chats..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>
    </div>
  );
}
