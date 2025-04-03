import React, { useState, useContext } from "react";
import { URL } from '../url';
import { ThemeContext } from '../context/ThemeContext';

const HomePosts = ({ post }) => {
    const { darkMode } = useContext(ThemeContext);
    const [imageError, setImageError] = useState(false);

    const getImageUrl = (photo) => {
        if (!photo) return null;
        return `/${photo.startsWith("uploads") ? photo : "uploads/" + photo}`;
    };

    if (!post || !post.slug) {
        console.error("Invalid post data:", post);
        return null;
    }

    return (
        <div
            className={`flex flex-col h-full justify-between rounded-xl p-6 mb-6 transition-all duration-300 shadow-md border
            ${darkMode
                    ? "bg-gray-900 text-gray-100 border-gray-700"
                    : "bg-white text-gray-800 border-gray-200"}`}
        >
            <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-bold line-clamp-2">
                    {post.title}
                </h2>

                <p className="text-base line-clamp-3">
                    {post.description}
                </p>

                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {post.categories.map((category, index) => (
                            <span
                                key={index}
                                className={`text-sm px-3 py-1 rounded-full font-medium
                                ${darkMode
                                        ? "bg-purple-900 text-purple-200"
                                        : "bg-purple-100 text-purple-600"}`}
                            >
                                #{category}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Author and Date */}
            <div className={`flex items-center gap-2 text-sm mt-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <span className="font-medium">By {post.username}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default HomePosts;
