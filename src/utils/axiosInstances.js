import axios from "axios"
import { BASE_URL } from "./apiPaths"

// creates a custom Axios object to Prevents requests to write every time
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

// middleware for axios
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // logout user or redirect
    }
    return Promise.reject(error);
  }
); 

export default axiosInstance

// Content-Type tells the server what you're sending.
// Accept tells the server what response format you expect.
// If the server doesn't respond within 80 seconds:Error: timeout exceeded


// "I created a centralized Axios instance to avoid repeating configuration such as base URL, headers, credentials, and timeout in every API call. It also allows me to add global interceptors for handling authentication, logging, token refresh, and error handling from a single place."