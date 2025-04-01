import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

import { URL } from '../url';
import backgroundImage from "../assets/deep-web.jpg";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Store error messages
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post(URL + "/api/auth/register", { username, email, password });

            // Reset fields on successful registration
            setUsername("");
            setEmail("");
            setPassword("");
            setError(""); // Clear any previous errors

            navigate("/login"); // Redirect to login
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleRegister();
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-gray-100"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >

            <div className="bg-gray-900 p-10 rounded-lg shadow-md w-80">
                <h2 className="text-2xl mb-4 text-center text-gray-100">Register</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>} {/* Show error message */}

                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="p-2 mb-4 border border-gray-100 rounded-md text-base outline-none placeholder-gray-400 bg-gray-800 text-white"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="p-2 mb-4 border border-gray-100 rounded-md text-base outline-none placeholder-gray-400 bg-gray-800 text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-2 mb-4 border border-gray-100 rounded-md text-base outline-none placeholder-gray-400 bg-gray-800 text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                    >
                        Register
                    </button>
                </form>
                <div className="text-center mt-4 mb-2 text-sm text-blue-500">
                    Already registered?
                    <Link to="/login" className="text-blue-600 pl-1 underline">Login here</Link>
                </div>
            </div>
        </div>
    );
}
