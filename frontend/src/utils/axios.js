import axios from "axios";
import { URL } from "../url.js";

const api = axios.create({
    baseURL: URL,
    withCredentials: true,
});

export default api;
