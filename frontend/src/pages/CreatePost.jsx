import { ImCross } from 'react-icons/im';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Plus } from 'lucide-react';

import { UserContext } from '../context/UserContext';
import { URL } from '../url';
import { ThemeContext } from '../context/ThemeContext';

const CreatePost = () => {
    const { darkMode } = useContext(ThemeContext);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [cat, setCat] = useState("");
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!user) {
                    const res = await axiosInstance.get("/api/auth/refetch");
                    if (res.data?.success) {
                        setUser(res.data.data);
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                        navigate('/login');
                    }
                } else {
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.error("Error checking authentication:", err);
                setIsAuthenticated(false);
                navigate('/login');
            }
        };

        checkAuth();
    }, [user, setUser, navigate]);

    // Handle file preview using FileReader
    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.onerror = () => {
            console.error('File reading failed');
            setPreviewUrl(null);
        };
        reader.readAsDataURL(file);
        return () => reader.abort();
    }, [file]);

    // If not authenticated, show loading or redirect
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const deleteCategory = (i) => {
        const updatedCats = [...cats];
        updatedCats.splice(i, 1);
        setCats(updatedCats);
    };

    const addCategory = () => {
        if (cat.trim()) {
            setCats([...cats, cat.trim()]);
            setCat("");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!title.trim() || !desc.trim() || !file) {
            setError("Title, content, and cover image are required");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("description", desc.trim());
            formData.append("username", user.username || "Anonymous");
            formData.append("userId", user._id);
            formData.append("photo", file);
            formData.append("categories", JSON.stringify(cats));

            const res = await axiosInstance.post(`/api/posts/create`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data?.success && res.data?.data?.slug) {
                navigate(`/post/${res.data.data.slug}`);
            } else {
                setError("Failed to create post: Invalid response");
            }
        } catch (err) {
            console.error("Error creating post:", err);
            setError(err.response?.data?.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex flex-col min-h-screen ${darkMode ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-purple-50 to-white"}`}>
            <main className="flex-grow pt-24 pb-20">
                <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`relative rounded-2xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} shadow-xl`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />

                        <div className="relative p-6 md:p-8">
                            <h1 className={`text-3xl md:text-4xl font-bold mb-8 text-center ${darkMode ? "text-white" : "text-gray-900"}`}>
                                Create Your Story
                            </h1>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mb-6 p-4 rounded-lg ${darkMode ? "bg-red-900/50 text-red-200" : "bg-red-50 text-red-600"} border-l-4 border-red-500`}
                                >
                                    <p>{error}</p>
                                </motion.div>
                            )}

                            <form className="w-full flex flex-col space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Title</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter a captivating title"
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"} outline-none focus:ring-2 focus:ring-purple-500`}
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Cover Image</label>
                                    <label className={`flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${darkMode ? "border-gray-600 hover:border-purple-500 hover:bg-gray-700/50" : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"}`}>
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <Upload className={`w-8 h-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                                            <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                {file ? file.name : "Click to upload a photo"}
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => setFile(e.target.files[0])}
                                        />
                                    </label>
                                    {previewUrl && (
                                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 flex justify-center">
                                            <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow-lg" />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Categories */}
                                <div className="space-y-4">
                                    <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Categories</label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            value={cat}
                                            onChange={(e) => setCat(e.target.value)}
                                            placeholder="Add a category"
                                            className={`flex-1 px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"} outline-none focus:ring-2 focus:ring-purple-500`}
                                        />
                                        <button
                                            type="button"
                                            onClick={addCategory}
                                            className={`px-4 py-3 rounded-lg ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"} text-white transition-colors`}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {cats.map((category, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center gap-2 px-3 py-1 rounded-full ${darkMode ? "bg-gray-700" : "bg-purple-100"} text-sm`}
                                            >
                                                <span className={darkMode ? "text-gray-300" : "text-purple-700"}>{category}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteCategory(index)}
                                                    className={`p-1 rounded-full ${darkMode ? "hover:bg-gray-600" : "hover:bg-purple-200"}`}
                                                >
                                                    <ImCross className={`w-3 h-3 ${darkMode ? "text-gray-400" : "text-purple-500"}`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Content</label>
                                    <textarea
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        placeholder="Write your story..."
                                        rows={10}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"} outline-none focus:ring-2 focus:ring-purple-500 resize-none`}
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    onClick={handleCreate}
                                    disabled={loading}
                                    className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : darkMode
                                            ? "bg-purple-600 hover:bg-purple-700"
                                            : "bg-purple-500 hover:bg-purple-600"
                                        }`}
                                >
                                    {loading ? "Creating..." : "Create Post"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default CreatePost;
