import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../url";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user from /api/auth/refetch only once on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${URL}/api/auth/refetch`, {
                    withCredentials: true,
                });

                if (res.data?.success) {
                    setUser(res.data.data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Error fetching user:", err.response?.data || err);
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
            await axios.get(`${URL}/api/auth/logout`, { withCredentials: true });
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
