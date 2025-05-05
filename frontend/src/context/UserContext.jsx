import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get(`/api/auth/refetch`);
                if (res.data.success) {
                    setUser(res.data.data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                // Don't log error if it's just an unauthorized request (no token)
                if (err.response?.status !== 401) {
                    console.log("Error fetching user:", err.response?.data?.message || err.message);
                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        console.log("Current user data:", user);
    }, [user]);

    const logout = async () => {
        try {
            await axiosInstance.get(`/api/auth/logout`);
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err.response?.data || err.message);
            throw err;
        }
    };

    const value = {
        user,
        setUser,
        logout,
        loading
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}