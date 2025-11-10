import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

 signup: async ({ name, email, password, confirmPassword }) => {
  set({ loading: true });

  if (password !== confirmPassword) {
    set({ loading: false });
    return toast.error("Incorrect confirm password");
  }

  try {
    const res = await axios.post('/auth/signup', { name, email, password });
    set({ user: res.data, loading: false });
    toast.success('User created successfully!');
  } catch (error) {
    console.error(error);
    const message = error.response?.data?.message || 'An error occurred while signing up';
    toast.error(message);
    set({ loading: false });
  }
},



 Login: async ( email, password ) => {
  set({ loading: true });

  try {
    const res = await axios.post('/auth/login', {  email, password });
    set({ user: res.data, loading: false });
    toast.success('User Loged-In Successfully!');

  } catch (error) {

    console.error(error);
    const message = error.response?.data?.message || 'An error occurred while signing up';
    toast.error(message);
    set({ loading: false });
  }
},



checkAuth: async () => {
  set({checkingAuth : true})
  try {
    const response = await axios.get('/auth/profile')
    set({user: response.data, checkingAuth:false})
  } catch (error) {
set({checkingAuth:false, user: null})
  }
},



logout: async () => {
  try {
    await axios.post('/auth/logout');
    set({user:null })
    toast.success("User Logout SuccesFully")
  } catch (error) {
    toast.error(error.response?.data?.message || "An occur while logout")
  }
},


refreshToken: async () => {
if (get().checkingAuth)return
set({checkingAuth : true});
try {
  const response = await axios.post("/auth/refresh-token")
  set({checkingAuth: false})
  return response.data
} catch (error) {
  set({user: null, checkingAuth: false})
  throw error;
}
}
}));


axios.interceptors.response.use((response) => response,
async(error) => {
  const originalRequest = error.config
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    try {
      if (refreshPromise) {
        await refreshPromise
        return axios(originalRequest)
      }

      refreshPromise = useUserStore.getState().refreshToken()
      await refreshPromise;
      refreshPromise = null      
      return axios(originalRequest)
    } catch (refreshError) {
      useUserStore.getState().logout()
      return Promise.reject(refreshError)
    }
  }
  return Promise.reject(error)
}
)