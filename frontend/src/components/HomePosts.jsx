/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { URL } from '../url';

const HomePosts = ({ post, darkMode }) => {
    const [imageError, setImageError] = useState(false);

    // Function to handle image URL
    const getImageUrl = (photo) => {
        if (!photo) return null;
        return `/${photo.startsWith("uploads") ? photo : "uploads/" + photo}`;
    };

    // Ensure post has required data
    if (!post || !post.slug) {
        console.error("Invalid post data:", post);
        return null;
    }

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col gap-5">
                <h2 className={`text-2xl font-bold line-clamp-2 ${darkMode ? "text-gray-100" : "text-gray-800"
                    }`}>
                    {post.title}
                </h2>

                {/* Description Preview */}
                <p className={`text-base line-clamp-3 ${darkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                    {post.description}
                </p>

                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {post.categories.map((category, index) => (
                            <span
                                key={index}
                                className={`text-base px-3 py-1 rounded-full ${darkMode
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

            {/* Author and Date - Moved to bottom */}
            <div className={`flex items-center gap-2 text-base mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                <span className="font-medium">By {post.username}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default HomePosts;
