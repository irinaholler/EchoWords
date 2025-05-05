import axios from "axios";
import { URL } from "../url.js";

const axiosInstance = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to only send credentials for protected or non-GET requests
axiosInstance.interceptors.request.use((config) => {
    // Only send credentials for non-GET requests or for protected routes
    if (
        config.method !== 'get' ||
        !config.url.startsWith('/api/posts')
    ) {
        config.withCredentials = true;
    } else {
        config.withCredentials = false;
    }
    return config;
});

export default axiosInstance;