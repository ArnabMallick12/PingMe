import React from 'react';
import {useChatStore} from '../store/useChatStore.js';

import  Sidebar  from '../components/Sidebar.jsx';
import  NoChatSelected  from '../components/NoChatSelected.jsx';
import  ChatContainer  from '../components/ChatContainer.jsx';

export default function HomePage() {
  const { selectedUser } = useChatStore();
  console.log('Selected User:', selectedUser); 

  return (
    <div className=" bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center">
      <div className="w-full max-w-7xl h-[calc(100vh-5.5rem)] flex justify-center px-2 sm:px-4 mt-3 mb-3">
        <div className="bg-base-200/90 rounded-2xl shadow-2xl w-full h-full flex overflow-hidden border border-gray-800/60">
          <Sidebar />
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
}
