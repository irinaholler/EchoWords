import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { URL } from "../url";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await axios.post(`/api/auth/register`, { username, email, password });

            // Clear form and redirect
            setUsername("");
            setEmail("");
            setPassword("");
            setError("");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`min-h-screen flex items-center justify-center px-4 py-10 ${darkMode
                ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
                : "bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-900"
                }`}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
                    }`}
            >
                <h2 className="text-3xl font-extrabold text-center mb-6">Join Connectify</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-sm text-red-600 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Username</label>
                        <input
                            type="text"
                            placeholder="yourname"
                            className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-300"
                                }`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-300"
                                }`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-gray-50 border-gray-300"
                                }`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 font-semibold rounded-lg text-white transition-all duration-300 ${loading
                            ? "bg-purple-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 hover:scale-[1.02]"
                            }`}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="text-center mt-6 text-sm">
                    Already have an account?
                    <Link to="/login" className="text-purple-600 font-semibold pl-1 hover:underline">
                        Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
