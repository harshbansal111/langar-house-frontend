import axios from 'axios';
import { supabase } from './supabaseClient';
import { toast } from 'react-toastify';

// This grabs your published Spring Boot backend URL from the .env file.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------------------------------
// REQUEST INTERCEPTOR: Automatically attach the JWT token
// -----------------------------------------------------
apiClient.interceptors.request.use(
  async (config) => {
    // 1. Ask Supabase for the current active local session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // 2. If a session exists, grab the raw JWT token
    if (session?.access_token) {
       // 3. Inject it into the Authorization header exactly how Spring Security expects
      config.headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// -----------------------------------------------------
// RESPONSE INTERCEPTOR: Global Error Handling
// -----------------------------------------------------
apiClient.interceptors.response.use(
  (response) => {
    // Any HTTP 2xx response passes through normally
    return response;
  },
  async (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // 401 Unauthorized: The Supabase JWT expired!
      console.warn("JWT expired or invalid. Forcing logout.");
      await supabase.auth.signOut(); // Wipe the dead session
      toast.error("Your session expired. Please log in again.");
      window.location.href = '/login'; // Kick them to the login screen
    } 
    else if (status === 403) {
      // 403 Forbidden: Valid JWT, but they are STAFF trying to do an ADMIN action
      toast.error("Access Denied: You do not have permission to do this.");
    } 
    else if (status === 429) {
      // 429 Too Many Requests: They hit Bucket4j's 100 req/min limit!
      toast.warning("Whoa there! You are sending too many requests. Slow down.");
    }
    else if (status >= 500) {
      toast.error("An internal server error occurred.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
