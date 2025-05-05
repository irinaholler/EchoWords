import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";

import ProfilePosts from "../components/ProfilePosts";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from '../context/ThemeContext';


function Profile() {
    // Hooks
    const { user, setUser, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const { darkMode } = useContext(ThemeContext);
    const { username: param } = useParams();
    const [username, setUsername] = useState(param || "");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [posts, setPosts] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [updateError, setUpdateError] = useState("");
    const [updated, setUpdated] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (param && user) {
            fetchProfile();
        }
    }, [param, user]);

    // UserContext.jsx

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/api/auth/refetch", {
                    withCredentials: true,
                });
                if (res.data.success) {
                    setUser(res.data.data);
                }
            } catch (err) {
                console.log("Error fetching user:", err.response?.data?.message || err.message);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    // All your other helper functions:

    async function fetchProfile() {
        setProfileLoading(true);
        setError(null);
        setPosts([]); // Reset posts when fetching new profile

        try {
            const res = await axiosInstance.get(`/api/users/username/${param}`);

            if (!res.data.success) {
                setError("Failed to fetch profile");
                return;
            }

            const data = res.data.data;
            setUsername(data.username);
            setEmail(data.email);
            setProfilePic(data.profilePic);

            // Check if this is the user's own profile
            setIsOwnProfile(user && user.username === data.username);

            // Fetch posts after we have the user data
            if (data._id) {
                await fetchUserPosts(data._id);
            }
        } catch (err) {
            console.error("Fetch profile error:", err);

            if (err.response?.status === 404) {
                setError("Profile not found");
            } else if (err.response?.status === 401) {
                navigate("/login");
            } else {
                setError("Failed to load profile");
            }
        } finally {
            setProfileLoading(false);
        }
    }

    async function fetchUserPosts(uid) {
        if (!uid) {
            console.error("No user ID provided for fetching posts");
            return;
        }

        try {
            console.log("Fetching posts for user:", uid);
            const res = await axiosInstance.get(`/api/posts/user/${uid}`);

            console.log("Posts response:", res.data);

            if (res.data.success) {
                // Ensure each post has a slug and correct username
                const postsWithSlugs = res.data.data.map(post => ({
                    ...post,
                    username: username, // Use the current username from profile
                    slug: post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                }));
                setPosts(postsWithSlugs);
            } else {
                console.error("Failed to fetch posts:", res.data.message);
                setPosts([]);
            }
        } catch (err) {
            console.error("Fetch posts error:", err.response?.data || err.message);
            if (err.response?.status === 401) {
                navigate("/login");
            } else {
                setPosts([]);
            }
        }
    }

    const handleUserUpdate = async () => {
        setUpdated(false);
        setUpdateError("");

        if (password && password !== confirmPassword) {
            setUpdateError("Passwords do not match");
            return;
        }

        try {
            const lowercaseUsername = username.toLowerCase();
            const updateData = { username: lowercaseUsername, email };
            if (password.trim()) {
                updateData.password = password;
            }

            // Step A: Update user's own data
            const res = await axiosInstance.patch(
                `/api/users/${user._id}`,
                updateData
            );

            if (res.data.success) {
                // Step B: After user is updated, also update all existing posts:
                try {
                    await axiosInstance.patch(
                        `/api/posts/updateUsername/${user._id}`,
                        { newUsername: lowercaseUsername }
                    );
                } catch (postErr) {
                    console.error("Error updating posts username:", postErr);
                }

                // Step C: Locally reflect that the user changed username
                setUpdated(true);
                setUser({ ...user, username: lowercaseUsername });
                setUsername(lowercaseUsername);

                setTimeout(() => {
                    navigate(`/profile/${lowercaseUsername}`);
                }, 100);
            } else {
                setUpdateError(res.data.message || "Update failed");
            }
        } catch (err) {
            console.error("Update error:", err.response?.data?.message || err);
            setUpdateError(err.response?.data?.message || "Update failed");
            setUpdated(false);
        }
    };

    const handleUserDelete = async () => {
        try {
            await axiosInstance.delete(`/api/users/${user._id}`);
            setUser(null);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    const handlePhotoUpload = async (e) => {
        if (!user?._id) return;
        const file = e.target.files?.[0];

        if (!file) return;
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("photo", file);
            const res = await axiosInstance.patch(
                `/api/users/${user._id}/profile-picture`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            if (res.data.success && res.data.data.profilePic) {
                setProfilePic(res.data.data.profilePic);
                setUser({ ...user, profilePic: res.data.data.profilePic });
                setUpdated(true);
            }
        } catch (err) {
            console.error("Upload error:", err.response?.data || err);
        } finally {
            setUploading(false);
        }
    };

    // Set of checks
    if (loading || profileLoading) {
        return <div className="pt-24 text-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!param) {
        return <div className="pt-24 text-center">No username provided!</div>;
    }

    if (error) {
        return (
            <div className="pt-24 text-center">
                <div className="text-red-500 text-xl mb-4">{error}</div>
                <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                    Go to Home
                </button>
            </div>
        );
    }

    const getProfileImageUrl = (profilePic) => {
        if (!profilePic) {
            return `https://robohash.org/${username}?set=set3&bgset=bg2&size=200x200`;
        }
        return `/uploads/profiles/${profilePic.split('/').pop()}`;
    };

    const imageSrc = getProfileImageUrl(profilePic);

    return (
        <div
            className={`min-h-screen pt-24 ${darkMode
                ? "bg-gradient-to-b from-gray-900 to-gray-800"
                : "bg-gradient-to-b from-purple-50 via-white to-blue-50"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:w-1/3"
                    >
                        <div
                            className={`sticky top-24 rounded-2xl overflow-hidden shadow-xl ${darkMode ? "bg-gray-800/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
                                } p-8 border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                        >
                            <div className="text-center mb-10 relative">
                                <div className="relative w-40 h-40 mx-auto mb-8">
                                    <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-800 rounded-full blur-xl opacity-30 animate-pulse`}></div>
                                    <div
                                        className={`w-full h-full rounded-full overflow-hidden border-4 ${darkMode ? "border-purple-600" : "border-purple-500"
                                            } relative group shadow-lg`}
                                    >
                                        <img
                                            src={imageSrc}
                                            alt={username}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {isOwnProfile && (
                                            <label
                                                htmlFor="profilePhotoInput"
                                                className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 ${uploading ? "pointer-events-none" : ""
                                                    }`}
                                            >
                                                {uploading ? (
                                                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <div className="text-white flex flex-col items-center transform group-hover:scale-110 transition-transform duration-300">
                                                        <FaCamera className="w-8 h-8 mb-2" />
                                                        <span className="text-sm font-medium">Change Photo</span>
                                                    </div>
                                                )}
                                            </label>
                                        )}
                                        <input
                                            type="file"
                                            id="profilePhotoInput"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            disabled={uploading}
                                        />
                                    </div>
                                </div>
                                <h1 className={`text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2`}>
                                    @{username}
                                </h1>
                                <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    {posts.length} stories shared
                                </p>
                            </div>
                            {isOwnProfile && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={`w-full px-4 py-3 rounded-xl border ${darkMode ? "bg-gray-700/50 border-gray-600 text-white" : "bg-gray-50/50 border-gray-200"
                                                } focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`w-full px-4 py-3 rounded-xl border ${darkMode ? "bg-gray-700/50 border-gray-600 text-white" : "bg-gray-50/50 border-gray-200"
                                                } focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full px-4 py-3 rounded-xl border ${darkMode
                                                ? "bg-gray-700/50 border-gray-600 text-white"
                                                : "bg-gray-50/50 border-gray-200"} 
        focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full px-4 py-3 rounded-xl border ${darkMode
                                                ? "bg-gray-700/50 border-gray-600 text-white"
                                                : "bg-gray-50/50 border-gray-200"} 
        focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm`}
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={handleUserUpdate}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl hover:from-purple-600 hover:to-purple-800 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                                        >
                                            Update Profile
                                        </button>
                                        <button
                                            onClick={handleUserDelete}
                                            className="px-4 py-3 text-red-500 hover:text-red-600 transition-colors focus:outline-none hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                    {updateError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-4 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm text-center border border-red-200 dark:border-red-800"
                                        >
                                            {updateError}
                                        </motion.div>
                                    )}
                                    {updated && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-4 rounded-xl bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm text-center border border-green-200 dark:border-green-800"
                                        >
                                            Profile updated successfully!
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:w-2/3"
                    >
                        <div
                            className={`rounded-2xl ${darkMode ? "bg-gray-800/80 backdrop-blur-sm" : "bg-white/80 backdrop-blur-sm"
                                } shadow-xl p-8 border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    {isOwnProfile ? "Your Stories" : `${username}'s Stories`}
                                </h2>
                                <div
                                    className={`px-4 py-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"
                                        } text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                                >
                                    {posts.length} {posts.length === 1 ? "story" : "stories"}
                                </div>
                            </div>
                            <div className="grid gap-8">
                                {posts.length > 0 ? (
                                    posts.map((p, index) => (
                                        <motion.div
                                            key={p._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <ProfilePosts p={p} darkMode={darkMode} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`text-center py-16 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                                    >
                                        <div className="text-6xl mb-4">📝</div>
                                        <p className="text-xl font-medium mb-2">No stories yet</p>
                                        <p className="text-sm">Start sharing your thoughts with the world!</p>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
