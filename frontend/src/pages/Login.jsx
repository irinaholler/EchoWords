import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import backgroundImage from "../assets/deep-web.jpg";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post(
                `${URL}/api/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            if (response.data.success) {
                // Set the user data from the response
                setUser(response.data.data);
                navigate("/");
            } else {
                setError(response.data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.message || "Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen w-full bg-gray-100"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="bg-gray-900 p-10 rounded-lg shadow-md w-80">
                <h2 className="text-2xl mb-4 text-center text-gray-100">Login</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-500 text-center text-sm">{error}</p>
                    </div>
                )}

                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="p-2 mb-4 border border-gray-100 rounded-md text-base outline-none placeholder-gray-400 text-gray-300 bg-gray-800"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-2 mb-4 border border-gray-100 rounded-md text-base outline-none placeholder-gray-400 text-gray-300 bg-gray-800"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <div className="text-center mt-4 mb-2 text-sm text-blue-500">
                        Not yet registered?
                        <Link to="/register" className="text-blue-600 pl-1 underline">Register here</Link>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out ${loading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-105 hover:shadow-xl"
                            }`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="text-center mt-6 text-sm text-blue-500 cursor-pointer">Forgot Password?</div>
            </div>
        </div>
    );
}
