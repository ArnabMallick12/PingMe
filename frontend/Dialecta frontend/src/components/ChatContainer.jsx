import React, { useEffect, useRef } from 'react';
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './MessageSkeleton';

function formatMessageTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const ChatContainer = () => {
  const { message, fetchMessages, isMessageLoading, selectedUser , subscribeToMessages,unsubscribeFromMessages} = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);

      subscribeToMessages();

      return () => {
        unsubscribeFromMessages(); 
      }
    }
  }, [selectedUser?._id, fetchMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && message) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message]);

  if (!selectedUser) return null;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isMessageLoading ? (
          <MessageSkeleton />
        ) : (
          message.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              ref={idx === message.length - 1 ? messageEndRef : null}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      msg.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(msg.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {msg.text && <p>{msg.text}</p>}
              </div>
            </div>
          ))
        )}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;