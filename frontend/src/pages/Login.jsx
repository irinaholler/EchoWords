import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { setUser } = useContext(UserContext);
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axiosInstance.post(`/api/auth/login`,
                { email, password }
            );

            if (response.data.success) {
                setUser(response.data.data);
                navigate("/");
            } else {
                setError(response.data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(
                error.response?.data?.message || "Invalid email or password. Please try again."
            );
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
                <h2 className="text-3xl font-extrabold text-center mb-6">Welcome Back</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
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
                            disabled={loading}
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
                            disabled={loading}
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="text-center mt-6 text-sm">
                    Don't have an account?
                    <Link to="/register" className="text-purple-600 font-semibold pl-1 hover:underline">
                        Register
                    </Link>
                </div>

                <div className="text-center mt-4 text-sm text-blue-500 cursor-pointer hover:underline">
                    Forgot Password?
                </div>
            </motion.div>
        </div>
    );
}