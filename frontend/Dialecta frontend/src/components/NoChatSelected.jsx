import React from 'react';
import { MessageCircle } from 'lucide-react';

const NoChatSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-gray-100 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 rounded-2xl shadow-inner border border-gray-800">
      <MessageCircle size={64} className="mb-4 text-primary animate-bounce" />
      <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Welcome to PingMe!</h2>
      <p className="text-center max-w-md text-gray-300">
        Select a conversation from the sidebar to start messaging.<br />
        Your chats will appear here. Enjoy a modern, seamless chat experience!
      </p>
    </div>
  );
};

export default NoChatSelected;