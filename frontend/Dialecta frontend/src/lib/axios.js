import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://pingme-lyz7.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
    withCredentials: true, // Include credentials for cross-origin requests
});