/* eslint-disable react/prop-types */
import { URL } from "../url";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePosts = ({ p, darkMode }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Function to handle image URL
    const getImageUrl = (photo) => {
        if (!photo) return null;
        return `/uploads/posts/${photo}`;
    };

    // Ensure post has required data
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
            <div className={`w-full flex mt-3 space-x-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
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
                        <div className="h-full w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <span className="text-gray-500 dark:text-gray-400">No Image</span>
                        </div>
                    )}
                </div>
                {/* Right: Post Details */}
                <div className="flex flex-col w-[65%]">
                    <h1 className={`text-xl font-bold md:mb-2 mb-1 md:text-2xl ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {title}
                    </h1>
                    <div className="flex mb-2 text-sm font-semibold text-gray-500 items-center justify-between md:mb-4">
                        <p>@{username}</p>
                        <div className="flex space-x-2">
                            <p>{updatedAt.toString().slice(0, 15)}</p>
                            <p>{updatedAt.toString().slice(16, 24)}</p>
                        </div>
                    </div>
                    <p className={`text-sm md:text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {description.slice(0, 200)}
                        {description.length > 200 && (
                            <span
                                onClick={() => setModalOpen(true)}
                                className="text-purple-600 cursor-pointer hover:underline ml-1"
                            >
                                ...Read more
                            </span>
                        )}
                    </p>
                    {/* Categories */}
                    {p.categories && p.categories.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-2">
                            {p.categories.map((category, index) => (
                                <span
                                    key={index}
                                    className={`text-sm px-2 py-1 rounded-full ${darkMode
                                        ? "bg-purple-900 text-purple-200"
                                        : "bg-purple-100 text-purple-600"
                                        }`}
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
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative max-w-lg w-full"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <button
                                onClick={() => setModalOpen(false)}
                                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300"
                            >
                                X
                            </button>
                            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {title}
                            </h2>
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
                            {/* Categories in modal */}
                            {p.categories && p.categories.length > 0 && (
                                <div className="flex gap-2 flex-wrap mt-4">
                                    {p.categories.map((category, index) => (
                                        <span
                                            key={index}
                                            className={`text-sm px-2 py-1 rounded-full ${darkMode
                                                ? "bg-purple-900 text-purple-200"
                                                : "bg-purple-100 text-purple-600"
                                                }`}
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
