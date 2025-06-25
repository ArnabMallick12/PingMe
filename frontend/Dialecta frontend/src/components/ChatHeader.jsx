import React from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) return null;

  return (
    <div className="p-4 border-b-2 border-gray-800 bg-gray-900/80 flex items-center justify-between rounded-t-2xl shadow-sm">
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="size-12 rounded-full overflow-hidden border-2 border-primary shadow">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullname || "User"}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-100 text-lg">{selectedUser.fullname}</h3>
          <p className="text-xs text-primary">
            {onlineUsers && onlineUsers.includes(selectedUser._id)
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>
      <button
        onClick={() => setSelectedUser(null)}
        className="p-2 rounded-full hover:bg-gray-800 transition-colors"
        title="Close chat"
      >
        <X className="w-5 h-5 text-primary" />
      </button>
    </div>
  );
};

export default ChatHeader;