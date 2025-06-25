import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import Signup from '../pages/Signup';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const SOCKET_URL =  'https://pingme-lyz7.onrender.com';


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isUpdatingProfile: false,
    onlineUsers : [],
    socket: null,
  

    checkAuth : async()=>{
        try {
            const res = await axiosInstance.get('/auth/check');
            const user = res.data;
            if(user){
                set({authUser: user, isCheckingAuth: false});
                get().connectSocket();
            }
            else{
                set({authUser: null, isCheckingAuth: false});
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
            set({authUser: null, isCheckingAuth: false});
        }
        finally{
            set({isCheckingAuth: false});   
        }
    },

    signup : async (data) =>{
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            if(res.status === 201){
                set({authUser: res.data.user, isSigningUp: false});
                toast.success('Signup successful');
                get().connectSocket();
            }
        }
            catch(error){
                toast.error('Signup failed');
                console.error("Error during signup:", error);
                throw error;
            }
            finally{
                set({isSigningUp: false});
        }
    },

    login: async (data) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post('/auth/login', data);
            if(res.status === 200){
                set({authUser: res.data.user, isLoggingIn: false});
                toast.success('Login successful');
                get().connectSocket();
            }
        }
        catch(error){
            toast.error('Login failed');
            console.error("Error during login:", error);
            throw error;
        }
        finally{
            set({isLoggingIn: false});
        }
    },

    logout: async () => {
        try {
          await axiosInstance.post('/auth/logout');
          set({ authUser: null, isLoggedIn: false });
          toast.success('Logged out successfully');
          get().disconnectSocket();
        } catch (error) {
          toast.error('Error logging out');
          console.log(error);
        }
      },

      updateProfile: async (data) => {
        try {
          set((state) => ({ isUpdatingProfile: true }));
          const response = await axiosInstance.put('/auth/update-profile', data);
          const updatedUser = response.data?.user || response.data;
          set((state) => ({
            authUser: { ...state.authUser, ...updatedUser },
          }));
          toast.success('Profile updated successfully');
        } catch (err) {
          toast.error(err.response?.data?.message || 'Error updating profile');
          console.log(err);
        } finally {
          set((state) => ({ isUpdatingProfile: false }));
        }
      },
      connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) {
            console.error('User not authenticated, cannot connect socket');
            return;
        }

        const socket = io(SOCKET_URL,{
            query: { userId: authUser._id },
        });
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        
        });
        set({ socket : socket });

        socket.on("getOnlineUsers", (users) => {
            console.log("Online users:", users);
            set({ onlineUsers: users });
        });
      },
      disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
        set({ socket: null });
        console.log('Socket disconnected');
      },
}));