import { useContext, useEffect, useState } from "react";
import { ImCross } from 'react-icons/im';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from '../context/ThemeContext';


const EditPost = () => {
    const { darkMode } = useContext(ThemeContext);
    const postId = useParams().id;
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const [previousPhoto, setPreviousPhoto] = useState("");
    const [cat, setCat] = useState("");
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const res = await axios.get(`/api/posts/${postId}`, { withCredentials: true });
            const post = res.data.data;
            setTitle(post.title);
            setDesc(post.description);
            setPreviousPhoto(post.photo);
            setCats(post.categories);
        } catch (err) {
            setError("Failed to load post");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (loading) return; // <- prevent multiple clicks
        setLoading(true);

        let imageUrl = previousPhoto;

        if (file) {
            const formData = new FormData();
            formData.append("photo", file);
            const uploadRes = await axios.patch(`/api/posts/${postId}/profile-picture`, formData, { withCredentials: true });
            if (uploadRes.data.success) imageUrl = uploadRes.data.data.photo;
        }

        try {
            const postData = { title, description: desc, username: user.username, userId: user._id, categories: cats, photo: imageUrl };
            const res = await axios.put(`/api/posts/${postId}`, postData, { withCredentials: true });
            if (res.data.success) navigate(`/post/${res.data.data.slug}`);
        } catch (err) {
            setError("Error updating post");
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = (i) => setCats(cats.filter((_, idx) => idx !== i));

    const addCategory = () => {
        const newCat = cat.trim().toLowerCase();
        if (newCat && !cats.includes(newCat)) setCats([...cats, newCat]);
        setCat("");
    };

    return (
        <div className={`min-h-screen pt-24 pb-12 ${darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-100 text-gray-800"}`}>
            <div className="max-w-3xl mx-auto px-4 md:px-8">
                <div className={`rounded-2xl shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"} px-8 py-10 md:px-12 md:py-14 relative overflow-hidden`}>
                    <h1 className="text-4xl font-bold mb-10 text-center">
                        Edit Your Story
                    </h1>

                    {error && (
                        <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-2 rounded-md mb-6 text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-8">
                        {/* Title Input */}
                        <div className="flex flex-col space-y-2">
                            <label className="font-semibold">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`w-full rounded-xl px-4 py-3 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} border focus:ring-2 ring-purple-400 outline-none transition duration-200`}
                                placeholder="Your captivating title..."
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="font-semibold">Cover Image</label>
                            <div className="flex items-center gap-4">
                                {(previousPhoto || file) && (
                                    <img
                                        src={file ? window.URL.createObjectURL(file) : `/uploads/posts/${previousPhoto}`}
                                        alt="Preview"
                                        className="w-36 h-36 object-cover rounded-lg shadow-md"
                                    />
                                )}
                                <label className="cursor-pointer flex-1 py-4 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 text-center hover:bg-gray-700 dark:hover:bg-gray-700 transition">
                                    <span className="text-gray-500 dark:text-gray-400">Select a new image</span>
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Categories Input */}
                        <div className="space-y-3">
                            <label className="font-semibold">Categories</label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={cat}
                                    onChange={(e) => setCat(e.target.value)}
                                    className={`flex-1 rounded-xl px-4 py-3 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} border focus:ring-2 ring-purple-400 outline-none transition duration-200`}
                                    placeholder="Add category"
                                />
                                <button
                                    type="button"
                                    onClick={addCategory}
                                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-6 transition duration-200"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {cats.map((c, i) => (
                                    <div key={i} className="bg-gradient-to-r from-purple-500 to-purple-800 text-white rounded-xl px-4 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow duration-300">
                                        {c}
                                        <button onClick={() => deleteCategory(i)} className="text-purple-500 dark:text-purple-100 hover:text-blue-800 transition">
                                            <ImCross size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="font-semibold">Story Content</label>
                            <textarea
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                rows={10}
                                className={`w-full rounded-xl px-4 py-3 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} border focus:ring-2 ring-purple-400 outline-none resize-none transition duration-200`}
                                placeholder="Tell your story..."
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="px-10 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl shadow transition disabled:opacity-50"
                            >
                                {loading ? "Updating..." : "Update Story"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="px-10 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-xl shadow transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPost;
