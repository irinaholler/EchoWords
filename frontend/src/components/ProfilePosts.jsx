import { useContext, useState } from "react";
import { ImCross } from 'react-icons/im';
import axiosInstance from "../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from '../context/ThemeContext';
import { URL } from '../url';

const ProfilePosts = ({ p }) => {
    const { darkMode } = useContext(ThemeContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const getImageUrl = (photo) => {
        if (!photo) return null;
        return `${URL}/uploads/posts/${photo}`;
    };

    if (!p || !p.slug) {
        console.error("Invalid post data:", p);
        return null;
    }

    const title = p.title || "";
    const username = p.username || "";
    const description = p.description || "";
    const updatedAt = p.updatedAt ? new Date(p.updatedAt) : new Date();
    const photoUrl = getImageUrl(p.photo);

    return (
        <>
            <div className={`w-full flex mt-4 space-x-4 rounded-xl p-4 transition-all duration-300 shadow border
                ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"}`}>

                {/* Left: Post Image */}
                <div className="w-[35%] h-[200px] flex justify-center items-center overflow-hidden rounded-lg">
                    {photoUrl && !imageError ? (
                        <img
                            src={photoUrl}
                            alt={title}
                            className="h-full w-full object-cover"
                            onError={() => {
                                console.error("Error loading image:", photoUrl);
                                setImageError(true);
                            }}
                        />
                    ) : (
                        <div className={`h-full w-full flex items-center justify-center rounded-lg
                            ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"}`}>
                            No Image
                        </div>
                    )}
                </div>

                {/* Right: Post Details */}
                <div className="flex flex-col w-[65%]">
                    <h1 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">{title}</h1>

                    <div className="flex justify-between text-sm font-semibold mb-3">
                        <p className="text-purple-400">@{username}</p>
                        <div className={`flex gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            <p>{updatedAt.toDateString()}</p>
                            <p>{updatedAt.toTimeString().slice(0, 8)}</p>
                        </div>
                    </div>

                    <p className={`text-sm md:text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {description.slice(0, 200)}
                        {description.length > 200 && (
                            <span
                                onClick={() => setModalOpen(true)}
                                className="text-purple-500 cursor-pointer hover:underline ml-1"
                            >
                                ...Read more
                            </span>
                        )}
                    </p>

                    {/* Categories */}
                    {p.categories?.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-3">
                            {p.categories.map((category, index) => (
                                <span
                                    key={index}
                                    className={`text-sm px-3 py-1 rounded-full font-medium
                                        ${darkMode ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-700"}`}
                                >
                                    #{category}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Overlay for full post */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 pt-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={`w-full max-w-4xl mx-4 rounded-xl overflow-hidden ${darkMode ? "bg-gray-900" : "bg-white"}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-2xl font-bold">{title}</h2>
                                    <button
                                        onClick={() => setModalOpen(false)}
                                        className={`p-2 rounded-full transition-colors duration-200
                                            ${darkMode
                                                ? "text-gray-300 hover:text-white hover:bg-gray-800"
                                                : "text-gray-600 hover:text-black hover:bg-gray-100"}`}
                                    >
                                        <ImCross className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    {photoUrl && !imageError ? (
                                        <img
                                            src={photoUrl}
                                            alt={title}
                                            className="w-full h-64 object-cover rounded-lg"
                                            onError={() => {
                                                console.error("Error loading image:", photoUrl);
                                                setImageError(true);
                                            }}
                                        />
                                    ) : (
                                        <div className={`w-full h-64 flex items-center justify-center rounded-lg
                                            ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"}`}>
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between text-sm font-semibold mb-4">
                                    <p className="text-purple-400">@{username}</p>
                                    <div className={`flex gap-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                        <p>{updatedAt.toDateString()}</p>
                                        <p>{updatedAt.toTimeString().slice(0, 8)}</p>
                                    </div>
                                </div>

                                <p className={`text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    {description}
                                </p>

                                {p.categories?.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mt-4">
                                        {p.categories.map((category, index) => (
                                            <span
                                                key={index}
                                                className={`text-sm px-3 py-1 rounded-full font-medium
                                                    ${darkMode ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-700"}`}
                                            >
                                                #{category}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProfilePosts;
