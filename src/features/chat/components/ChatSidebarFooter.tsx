import { Settings, User } from "lucide-react";

export default function ChatSidebarFooter() {
  return (
    <div className="p-3 border-t border-gray-300 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
          <User size={16} />
        </div>
        <div>
          <p className="text-sm font-medium">Abel</p>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>

      <button
        type="button"
        className="p-2 rounded-lg hover:bg-gray-300 transition"
      >
        <Settings size={18} />
      </button>
    </div>
  );
}
