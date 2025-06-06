import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../utils/axios";
import { URL } from "../url";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from '../context/ThemeContext';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const { darkMode } = useContext(ThemeContext);
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState("");
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const search = useLocation().search;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoader(true);
                setError("");
                console.log("Fetching posts with search:", search);
                const res = await axiosInstance.get(`/api/posts${search}`);
                console.log("Posts response:", res.data);

                if (res.data?.success && Array.isArray(res.data.data)) {
                    setPosts(res.data.data);
                } else {
                    console.error("Invalid posts data format:", res.data);
                    setError("Failed to load posts: Invalid data format");
                }
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError(err.response?.data?.message || "Failed to load posts");
            } finally {
                setLoader(false);
            }
        };

        fetchPosts();
    }, [search]);

    const getImageUrl = (photo) => {
        if (!photo) return null;
        return `${URL}/uploads/posts/${photo}`;
    };

    return (
        <div
            className={`min-h-screen ${darkMode
                ? "bg-gray-900 text-gray-100"
                : "bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-900"
                }`}
        >
            {/* Hero Section */}
            <div className="relative py-16 sm:py-24">
                <div
                    className={`absolute inset-0 ${darkMode
                        ? "bg-gradient-to-r from-purple-900/30 to-blue-900/30"
                        : "bg-gradient-to-r from-purple-400/10 to-blue-500/10"
                        }`}
                ></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight ${darkMode ? "text-gray-100" : "text-gray-900"
                            } mb-4`}
                    >
                        Discover Amazing Stories
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={`max-w-2xl mx-auto text-xl ${darkMode ? "text-gray-200" : "text-gray-600"
                            }`}
                    >
                        Explore a world of inspiring stories and creative minds
                    </motion.p>

                    {user ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-8"
                        >
                            <button
                                onClick={() => navigate("/create")}
                                className={`inline-flex items-center px-8 py-3 border border-transparent 
                                    text-base font-medium rounded-xl text-white 
                                    ${darkMode
                                        ? "bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500"
                                        : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                                    }
                                    transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                            >
                                Share Your Story
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-8 flex gap-4 justify-center"
                        >
                            <button
                                onClick={() => navigate("/login")}
                                className={`inline-flex items-center px-8 py-3 border border-transparent 
                                    text-base font-medium rounded-xl text-white 
                                    ${darkMode
                                        ? "bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500"
                                        : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                                    }
                                    transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className={`inline-flex items-center px-8 py-3 border border-transparent 
                                    text-base font-medium rounded-xl text-white 
                                    ${darkMode
                                        ? "bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500"
                                        : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                                    }
                                    transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                            >
                                Register
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Posts Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {loader ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Loader />
                    </div>
                ) : !user ? (
                    <div className={`rounded-lg p-8 text-center ${darkMode ? "bg-gray-800 text-gray-200 border border-gray-700" : "bg-white text-gray-800 border-gray-200"} shadow-xl max-w-2xl mx-auto`}>
                        <h3 className="text-2xl font-bold mb-4">Welcome to Our Blog!</h3>
                        <p className={`text-lg mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            You need to log in to view the posts. Please log in or register to continue.
                        </p>
                    </div>
                ) : error ? (
                    <div className={`rounded-lg p-8 text-center ${darkMode ? "bg-gray-800 text-red-300 border border-red-700" : "bg-white text-red-500 border-red-300"} shadow-xl max-w-2xl mx-auto`}>
                        <h3 className="text-xl font-semibold">{error}</h3>
                    </div>
                ) : posts.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl ${darkMode ? "bg-gray-800 text-gray-200 border border-gray-700" : "bg-white text-gray-800 border-gray-200"} shadow-xl max-w-2xl mx-auto`}>
                        <h3 className="text-2xl font-bold mb-4">No Posts Yet</h3>
                        <p className={`text-lg mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Be the first to share your story!
                        </p>
                        {user && (
                            <button
                                onClick={() => navigate("/create")}
                                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200
                                    ${darkMode
                                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                                        : "bg-purple-500 hover:bg-purple-600 text-white"
                                    }`}
                            >
                                Create Your First Post
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.015 }}
                                whileTap={{ scale: 0.985 }}
                                className="h-full cursor-pointer group"
                                onClick={() => navigate(`/post/${post.slug}`)}
                            >
                                <div
                                    className={`h-[600px] rounded-3xl overflow-hidden relative ${darkMode
                                        ? "bg-gray-800 hover:bg-gray-750"
                                        : "bg-white hover:bg-gray-100"
                                        } shadow-xl transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-2xl`}
                                >
                                    <div className="h-[350px] w-full overflow-hidden">
                                        {post.photo && (
                                            <img
                                                src={getImageUrl(post.photo)}
                                                alt={post.title}
                                                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    console.error("Error loading image:", post.photo);
                                                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col h-[250px] justify-between">
                                        <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                            {post.title}
                                        </h3>
                                        <p className={`text-sm leading-relaxed line-clamp-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            {post.description}
                                        </p>
                                        <p className="mt-2 text-sm italic text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            Read more...
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
