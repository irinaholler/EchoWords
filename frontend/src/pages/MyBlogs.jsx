import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import axiosInstance from "../utils/axios";
import HomePosts from "../components/HomePosts";
import Loader from "../components/Loader";
import { ThemeContext } from '../context/ThemeContext';

const MyBlogs = () => {
    const { darkMode } = useContext(ThemeContext);
    const { search } = useLocation();
    const [posts, setPosts] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);

    const fetchPosts = useCallback(async () => {
        if (!user?._id) return;
        setLoader(true);
        setError(null);
        try {
            const res = await axiosInstance.get(`/api/posts/user/${user._id}`);
            if (res.data?.success) {
                setPosts(res.data.data);
                setNoResults(res.data.data.length === 0);
            } else {
                setError("Failed to fetch posts");
            }
        } catch (err) {
            console.error("Error fetching user's posts:", err);
            setError(err.response?.data?.message || "Failed to fetch posts");
        } finally {
            setLoader(false);
        }
    }, [user?._id]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return (
        <div className={`px-8 md:px-[200px] min-h-[80vh] ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            {loader ? (
                <div className="h-[40vh] flex justify-center items-center">
                    <Loader />
                </div>
            ) : error ? (
                <div className={`text-center mt-16 p-4 rounded-lg ${darkMode ? "bg-red-900/50 text-red-200" : "bg-red-50 text-red-600"}`}>
                    <h3 className="font-bold">{error}</h3>
                    <button
                        onClick={fetchPosts}
                        className={`mt-4 px-4 py-2 rounded-lg ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"} text-white transition-colors`}
                    >
                        Try Again
                    </button>
                </div>
            ) : noResults ? (
                <div className={`text-center mt-16 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <h3 className="text-xl font-bold mb-4">No posts available</h3>
                    <p className="mb-4">Start sharing your stories with the world!</p>
                    <Link
                        to="/create"
                        className={`inline-block px-6 py-3 rounded-lg ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"} text-white transition-colors`}
                    >
                        Create Your First Post
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <Link
                            key={post._id}
                            to={user && post.slug ? `/post/${post.slug}` : "/login"}
                            onClick={(e) => {
                                if (!post.slug) {
                                    e.preventDefault();
                                    console.error("Post slug is missing:", post);
                                }
                            }}
                        >
                            <HomePosts post={post} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBlogs;
