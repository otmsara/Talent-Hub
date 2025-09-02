import axios from "axios";
import Cookies from 'js-cookie';
import { refreshToken } from "../components/actions";

// Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://arya-job-matching.azurewebsites.net";
const API_PREFIX = "/api"; // Your API route prefix

console.log("API Configuration:", {
  baseURL: API_BASE_URL,
  apiPrefix: API_PREFIX
});

// Create an instance of axios with the base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    "Content-Type": "application/json",
    // Add any common headers here
  },
});

// Create authenticated instance
export function axiosAuth() {
  const axiosPrivate = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
  });

  // Request interceptor
  axiosPrivate.interceptors.request.use(
    async (config) => {
      const access_token = Cookies.get("arya_access_token");
      const refresh_token = Cookies.get("arya_refresh_token");

      if (!access_token && !refresh_token) {
        console.error("No tokens available");
        return Promise.reject(new Error("No authentication tokens found"));
      }

      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      } else if (refresh_token) {
        try {
          const { newAccess } = await refreshToken(refresh_token);
          config.headers.Authorization = `Bearer ${newAccess}`;
          Cookies.set("arya_access_token", newAccess, {
            path: "/",
            sameSite: "strict",
            secure: import.meta.env.PROD
          });
        } catch (error) {
          console.error("Failed to refresh token:", error);
          // Optionally redirect to login here
          throw error;
        }
      }
      
      // Ensure API prefix is added to all requests
      if (!config.url.startsWith(API_PREFIX)) {
        config.url = `${API_PREFIX}${config.url.startsWith('/') ? '' : '/'}${config.url}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axiosPrivate.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        console.error("Authentication failed. Clearing tokens.");
        Cookies.remove("arya_access_token", { path: "/" });
        Cookies.remove("arya_refresh_token", { path: "/" });
        // Optionally redirect to login here
      }
      return Promise.reject(error);
    }
  );

  return axiosPrivate;
}

// Specific API methods
export const matchCV = (data) => {
  return axiosAuth().post('/match-cv', data);
};

// Export both the basic and authenticated clients
export default apiClient;