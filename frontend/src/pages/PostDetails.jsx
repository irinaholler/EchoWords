import { useNavigate, useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import slugify from "slugify";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import { UserContext } from "../context/UserContext";
import Comment from "../components/Comment";
import Loader from "../components/Loader";
import { URL } from "../url";

const PostDetails = ({ darkMode }) => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user, loading: userLoading } = useContext(UserContext);

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);

    // ---- Fetch Post by Slug ----
    const fetchPost = async () => {
        if (!slug) {
            setError("Invalid post URL");
            setLoader(false);
            return;
        }

        try {
            console.log("Fetching post with slug:", slug);
            const res = await axios.get(`/api/posts/slug/${slug}`, {
                withCredentials: true,
            });

            if (res.data?.success) {
                const fetchedPost = res.data.data;

                // Optionally fetch the author's current username
                try {
                    const userRes = await axios.get(`/api/users/${fetchedPost.userId}`, {
                        withCredentials: true,
                    });
                    if (userRes.data?.success) {
                        fetchedPost.username = userRes.data.data.username;
                    }
                } catch (userErr) {
                    console.error("Error fetching user data:", userErr);
                }

                // If post has no slug in DB, generate & update
                if (!fetchedPost.slug) {
                    const newSlug = slugify(fetchedPost.title, {
                        lower: true,
                        strict: true,
                        remove: /[*+~.()'"!:@]/g,
                    });
                    await axios.put(
                        `/api/posts/${fetchedPost._id}`,
                        { ...fetchedPost, slug: newSlug },
                        { withCredentials: true }
                    );
                    fetchedPost.slug = newSlug;
                }

                setPost(fetchedPost);
                fetchPostComments(fetchedPost._id);
            } else {
                setError(res.data?.message || "Failed to load post");
            }
            setLoader(false);
        } catch (err) {
            console.error("Error fetching post:", err);
            setError(err.response?.data?.message || "Failed to load post");
            setLoader(false);

            if (err.response?.status === 401) {
                navigate("/login");
            } else if (err.response?.status === 500) {
                setError("Server error occurred. Please try again later.");
            }
        }
    };

    // ---- Fetch Comments ----
    const fetchPostComments = async (postId) => {
        if (!postId) return;
        try {
            const res = await axios.get(`/api/comments/post/${postId}`, {
                withCredentials: true,
            });
            if (Array.isArray(res.data) && res.data.length > 0) {
                const commentsWithUsernames = await Promise.all(
                    res.data.map(async (commentObj) => {
                        try {
                            const userRes = await axios.get(`/api/users/${commentObj.userId}`, {
                                withCredentials: true,
                            });
                            if (userRes.data?.success) {
                                return { ...commentObj, author: userRes.data.data.username };
                            }
                            return commentObj;
                        } catch (userErr) {
                            console.error("Error fetching comment user:", userErr);
                            return commentObj;
                        }
                    })
                );
                setComments(commentsWithUsernames);
            } else {
                setComments(res.data);
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
            setError(err.response?.data?.message || "Failed to load comments");
        }
    };

    // ---- Delete Post ----
    const handleDeletePost = async () => {
        if (!post?._id) {
            setError("Post ID not found");
            return;
        }
        try {
            await axios.delete(`/api/posts/${post._id}`, {
                withCredentials: true,
            });
            navigate("/");
        } catch (err) {
            console.error("Error deleting post:", err);
            setError("Failed to delete post");
        }
    };

    // ---- Add Comment ----
    const postComment = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in to post a comment.");
            return;
        }
        if (!comment.trim()) return;

        try {
            const response = await axios.post(
                `/api/comments/create`,
                {
                    comment,
                    author: user.username,
                    postId: post._id,
                    userId: user._id,
                },
                { withCredentials: true }
            );
            if (response.data.success) {
                setComment("");
                fetchPostComments(post._id);
            }
        } catch (err) {
            console.error("Error posting comment:", err);
            setError(err.response?.data?.message || "Failed to post comment");
        }
    };

    // ---- Helper for Post Image ----
    const getImageUrl = (photo) => {
        if (!photo) return null;
        return `/uploads/posts/${photo}`;
    };

    // ---- useEffect to fetch post if slug changes ----
    useEffect(() => {
        if (slug) {
            fetchPost();
        } else {
            setError("Invalid post URL");
            setLoader(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    // ---- Conditionals ----
    if (userLoading) {
        return (
            <div className="h-[80vh] flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    if (!post && !loader) {
        return (
            <div className="h-[80vh] flex justify-center items-center">
                <p className="text-xl text-gray-500">Post not found</p>
            </div>
        );
    }

    // ---- Main UI ----
    return (
        <div
            className={`min-h-screen pb-24 ${darkMode
                ? "bg-gradient-to-b from-gray-900 to-gray-800"
                : "bg-gradient-to-b from-purple-50 via-white to-blue-50"
                }`}
        >
            <div className="relative pt-32 pb-16">
                <div
                    className={`absolute inset-0 ${darkMode
                        ? "bg-gradient-to-r from-purple-900/30 to-blue-900/30"
                        : "bg-gradient-to-r from-purple-400/10 to-blue-500/10"
                        }`}
                ></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-theme(space.32))]">
                    {loader ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <Loader />
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center p-8">{error}</div>
                    ) : (
                        <div className="space-y-8">
                            {/* Post Title & Author */}
                            <div className="text-center max-w-3xl mx-auto">
                                <h1
                                    className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-gray-900"
                                        } mb-4`}
                                >
                                    {post?.title}
                                </h1>
                                <div
                                    className={`flex items-center justify-center space-x-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"
                                        }`}
                                >
                                    <span>By @{post?.username}</span>
                                    <span>•</span>
                                    <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Post Image */}
                            {post?.photo && (
                                <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
                                    <img
                                        src={getImageUrl(post.photo)}
                                        alt={post.title}
                                        className="w-full h-[500px] object-cover"
                                        onError={(e) => {
                                            console.log("Failed to load image:", post.photo);
                                            e.target.onerror = null;
                                            e.target.src =
                                                "https://via.placeholder.com/400x300?text=Image+not+available";
                                        }}
                                    />
                                </div>
                            )}

                            {/* Categories */}
                            {post?.categories?.length > 0 && (
                                <div className="flex justify-center flex-wrap gap-2">
                                    {post.categories.map((category, index) => (
                                        <span
                                            key={index}
                                            className={`px-4 py-1 rounded-full text-sm ${darkMode
                                                ? "bg-gray-800 text-gray-300"
                                                : "bg-purple-100 text-purple-800"
                                                }`}
                                        >
                                            {category}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Post Description */}
                            <div
                                className={`max-w-3xl mx-auto prose ${darkMode ? "prose-invert" : ""
                                    } px-4`}
                            >
                                <p
                                    className={`text-lg leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    {post?.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-center space-x-4">
                                {user &&
                                    post &&
                                    String(user._id) === String(post.userId) && (
                                        <>
                                            <Link
                                                to={`/edit/${post._id}`}
                                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                            >
                                                Edit Post
                                            </Link>
                                            <button
                                                onClick={handleDeletePost}
                                                className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                                            >
                                                Delete Post
                                            </button>
                                        </>
                                    )}
                                <button
                                    onClick={() => navigate("/")}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>

                            {/* Comments Section */}
                            <div
                                className={`max-w-3xl mx-auto mt-16 mb-12 ${darkMode ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                <h2 className="text-2xl font-bold mb-8">Comments</h2>
                                <div className="mb-8">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                            ? "bg-gray-800 border-gray-700 text-white"
                                            : "bg-white border-gray-200"
                                            } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                                        rows="4"
                                    />
                                    <button
                                        onClick={postComment}
                                        className="mt-4 mb-24 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Post Comment
                                    </button>
                                </div>

                                <div className="space-y-6 mb-16">
                                    {comments.map((c) => (
                                        <Comment key={c._id} c={c} darkMode={darkMode} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetails;
