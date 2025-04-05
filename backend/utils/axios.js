import axios from 'axios';
import { URL } from '../url';

const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default axiosInstance;