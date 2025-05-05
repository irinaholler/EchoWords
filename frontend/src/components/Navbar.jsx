import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import axios from 'axios';

import { UserContext } from '../context/UserContext';
import { FiSearch } from 'react-icons/fi';
import { URL } from '../url.js';
import logo from "../assets/logo.png";
import { ThemeContext } from '../context/ThemeContext';


const Navbar = () => {
    const { user, setUser } = useContext(UserContext);
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.get(`${URL}/api/auth/logout`, { withCredentials: true });
            setUser(null);
            navigate("/welcome");
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchQuery.trim()) {
            setLoading(true);
            navigate(`/?search=${searchQuery}`);
            setSearchQuery(""); // ← Reset search input after navigating

            // Optional: Add slight delay to keep spinner visible
            setTimeout(() => setLoading(false), 500); // Adjust if needed
        }
    };

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 ${darkMode ? "bg-gray-900" : "bg-white"} shadow-md`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-2 flex items-center justify-between h-16">
                <div className="flex items-center">
                    <Link to="/welcome" className="flex items-center">
                        <img src={logo} alt="Connectify Logo" className="w-8 h-8 object-contain" />
                        <h1 className="text-2xl font-bold text-purple-500 hover:text-purple-600 transition-colors ml-2">
                            Connectify
                        </h1>
                    </Link>
                </div>

                <div className="hidden md:flex space-x-8 ml-20">
                    <Link to="/" className={`${darkMode ? "text-gray-300" : "text-gray-600"} hover:text-purple-500 transition-colors`}>Home</Link>
                    <Link to="/about" className={`${darkMode ? "text-gray-300" : "text-gray-600"} hover:text-purple-500 transition-colors`}>About</Link>
                    <Link to="/contact" className={`${darkMode ? "text-gray-300" : "text-gray-600"} hover:text-purple-500 transition-colors`}>Contact</Link>
                </div>

                <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            disabled={loading}
                            className={`w-full px-3 py-1.5 rounded-lg transition-all duration-200 pr-10
        focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500
        ${loading ? "opacity-70 cursor-wait" : ""}
        ${darkMode ? "bg-gray-800 text-gray-200 placeholder-gray-400" : "bg-gray-100 text-gray-800"}`}
                        />

                        {/* ✕ Clear Button */}
                        {searchQuery && !loading && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-1xl text-gray-400 hover:text-purple-500 hover:scale-160 transition"
                                aria-label="Clear search"
                            >
                                &times;
                            </button>
                        )}
                    </div>

                    <button type="submit" className="ml-2 p-1.5 text-gray-400 hover:text-purple-500">
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : (
                            <FiSearch size={20} />
                        )}
                    </button>
                </form>

                <div className="flex items-center space-x-8">
                    <button onClick={toggleDarkMode} aria-label="Toggle dark mode" className={`p-2 rounded-full transition-transform hover:scale-110 ${darkMode ? "text-yellow-300 bg-gray-800" : "text-gray-600 bg-gray-100"}`}>
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user ? (
                        <div className="flex items-center space-x-8">
                            <Link to="/create" className="hidden md:block px-3 py-1.5 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">Create Post</Link>
                            <Link to={`/profile/${user.username}`} className={`hidden md:block ${darkMode ? "text-gray-300" : "text-gray-600"} hover:text-purple-500 transition-colors`}>Profile</Link>
                            <button onClick={handleLogout} className={`${darkMode ? "text-gray-300" : "text-gray-600"} hover:text-purple-500 transition-colors`}>Logout</button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-8">
                            <Link to="/login" className={`${darkMode ? "text-gray-300" : "text-gray-600"} hover:text-purple-500 transition-colors`}>Login</Link>
                            <Link to="/register" className="px-3 py-1.5 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">Join Now</Link>
                        </div>
                    )}
                </div>

                {/* Burger Icon */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-800 dark:text-purple-500 focus:outline-none md:hidden z-50 relative"
                >
                    {isOpen ? (
                        <IoClose className="w-7 h-7 transition-transform duration-300 rotate-90" />
                    ) : (
                        <HiOutlineMenuAlt3 className="w-7 h-7 transition-transform duration-300" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`absolute top-16 right-4 w-64 z-40 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
                            } p-4 rounded-xl shadow-xl md:hidden border ${darkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                    >
                        <div className="flex flex-col space-y-4">
                            <Link
                                to="/"
                                className="hover:text-purple-500 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/create"
                                className="hover:text-purple-500 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Create Post
                            </Link>
                            <Link
                                to={`/profile/${user?.username}`}
                                className="hover:text-purple-500 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Profile
                            </Link>
                            <button
                                onClick={() => {
                                    toggleDarkMode();
                                    setIsOpen(false);
                                }}
                                className="mt-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md hover:from-purple-600 hover:to-purple-900 transition-all"
                            >
                                {darkMode ? "Light Mode" : "Dark Mode"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
