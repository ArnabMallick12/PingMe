import { create } from "zustand";
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) =>({

    message: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    fetchUsers: async () => {
        set({ isUserLoading: true });
        try {
            const response = await axiosInstance.get('/messages/users');
            set({ users: response.data });
        } catch (error) {
            toast.error('Error fetching users');
            console.log(error);
        }
        finally {
            set({ isUserLoading: false });
        }
    },

    fetchMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ message: response.data });
        } catch (error) {
            toast.error('Error fetching messages');
            console.log(error);
        }
        finally {
            set({ isMessageLoading: false });
        }
    },

    setSelectedUser : (selectedUser) =>{
        set({selectedUser})
    },

    sendMessage: async (messageData) => {
        const { selectedUser, message } = get();
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          set({ message: [...message, res.data] });
        } catch (error) {
          const msg = error?.response?.data?.message || error?.message || 'Failed to send message';
          toast.error(msg);
        }
      },

      subscribeToMessages: () => {
        const {selectedUser, message} = get();
        if (!selectedUser) {
            return;
        }

        const socket = useAuthStore.getState().socket;
        socket.on('newMessage', (newMessage) => {
            if (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id) {
                set({ message: [...get().message, newMessage] });
            }
            }
        );
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
    },
}));