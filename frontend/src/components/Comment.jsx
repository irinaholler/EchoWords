import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { MdDelete } from 'react-icons/md';
import { BiEdit } from 'react-icons/bi';
import axios from 'axios';
import { URL } from '../url.js';
import { ThemeContext } from '../context/ThemeContext';

const Comment = ({ c }) => {
    const { darkMode } = useContext(ThemeContext);
    const { user } = useContext(UserContext);
    const [editMode, setEditMode] = useState(false);
    const [editedComment, setEditedComment] = useState(c.comment);

    const deleteComment = async (id) => {
        try {
            await axios.delete(`/api/comments/${id}`, { withCredentials: true });
            window.location.reload(true);
        } catch (err) {
            console.log(err);
        }
    };

    const updateComment = async () => {
        try {
            const res = await axios.put(
                `/api/comments/${c._id}`,
                { comment: editedComment },
                { withCredentials: true }
            );
            if (res.data) {
                setEditMode(false);
                window.location.reload(true);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={`px-4 py-3 rounded-lg my-2 border transition-all duration-300
            ${darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"}`}>
            <div className="flex items-center justify-between">
                <h3 className="font-bold">@{c.author}</h3>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400 dark:text-gray-400">
                        <span>{new Date(c.updatedAt).toLocaleDateString()}</span>
                        <span className="ml-2">{new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {user?._id === c?.userId && (
                        <div className="flex items-center space-x-2">
                            <button onClick={() => setEditMode(!editMode)} className="text-blue-500 hover:text-blue-600">
                                <BiEdit size={18} />
                            </button>
                            <button onClick={() => deleteComment(c._id)} className="text-purple-600 hover:text-purple-800">
                                <MdDelete size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {editMode ? (
                <div className="mt-2">
                    <textarea
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                        className={`w-full px-4 py-2 mt-2 rounded-lg border resize-none
                        ${darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"}`}
                        rows="3"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            onClick={() => setEditMode(false)}
                            className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={updateComment}
                            className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <p className="mt-2">{c.comment}</p>
            )}
        </div>
    );
};

export default Comment;
