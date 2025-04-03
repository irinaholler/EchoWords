import { useContext, useState } from "react";
import { ImCross } from 'react-icons/im';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from '../context/ThemeContext';
import { URL } from "../url";

const ProfilePosts = ({ p }) => {
    const { darkMode } = useContext(ThemeContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const getImageUrl = (photo) => {
        if (!photo) return null;
        return `/uploads/posts/${photo}`;
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
                            onError={() => setImageError(true)}
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
                            className={`p-6 rounded-lg shadow-lg relative max-w-lg w-full 
                                ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <button
                                onClick={() => setModalOpen(false)}
                                className={`absolute top-2 right-2 text-xl font-bold
                                    ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"}`}
                            >
                                <ImCross />
                            </button>
                            <h2 className="text-2xl font-bold mb-4">{title}</h2>

                            {photoUrl && (
                                <img
                                    src={photoUrl}
                                    alt={title}
                                    className="w-full h-auto rounded mb-4"
                                    onError={() => setImageError(true)}
                                />
                            )}

                            <p className={`text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                {description}
                            </p>

                            {/* Modal Categories */}
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
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProfilePosts;
