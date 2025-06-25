import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { fetchUsers, users, selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users
    .filter((user) =>
      showOnlineOnly ? onlineUsers.includes(user._id) : true
    )
    .filter((user) =>
      user.fullname?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-gray-800 flex flex-col bg-gray-900/80">
      <div className="border-b border-gray-800 w-full p-5">
        <div className="flex items-center gap-2 mb-2">
          <Users className="size-6 text-primary" />
          <span className="font-semibold hidden lg:block text-gray-100">Contacts</span>
        </div>
        <div className="hidden lg:flex items-center gap-2 mb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="input input-sm input-bordered w-full pl-8 rounded-lg bg-gray-800 text-gray-100 border-gray-700 focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-2 top-2.5 size-4 text-primary" />
          </div>
        </div>
        <div className="mt-2 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm text-gray-300">Show online only</span>
          </label>
          <span className="text-xs text-gray-400">({Math.max(onlineUsers.length - 1, 0)} online)</span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3 flex-1">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors duration-150 hover:bg-gray-800/60 focus:bg-gray-800/80 border-none outline-none ${selectedUser?._id === user._id ? "bg-gray-800/80 ring-2 ring-primary" : ""}`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullname}
                className="size-12 object-cover rounded-full border border-gray-700 shadow-sm"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-gray-900" />
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-semibold truncate text-gray-100">{user?.fullname || "name"}</div>
              <div className="text-xs text-gray-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;