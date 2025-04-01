import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { MdDelete } from 'react-icons/md';
import { BiEdit } from 'react-icons/bi';
import axios from 'axios';
import { URL } from '../url';

const Comment = ({ c, darkMode }) => {
    const { user } = useContext(UserContext);
    const [editMode, setEditMode] = useState(false);
    const [editedComment, setEditedComment] = useState(c.comment);

    const deleteComment = async (id) => {
        try {
            await axios.delete(`${URL}/api/comments/${id}`, {
                withCredentials: true,
            });
            window.location.reload(true);
        } catch (err) {
            console.log(err);
        }
    };

    const updateComment = async () => {
        try {
            const res = await axios.put(
                `${URL}/api/comments/${c._id}`,
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
        <div className={`px-4 py-3 rounded-lg my-2 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <div className="flex items-center justify-between">
                <h3 className={`font-bold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    @{c.author}
                </h3>
                <div className="flex items-center space-x-4">
                    <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        <span>{new Date(c.updatedAt).toString().slice(0, 15)}</span>
                        <span className="ml-2">{new Date(c.updatedAt).toString().slice(16, 24)}</span>
                    </div>
                    {user?._id === c?.userId && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className="text-blue-500 hover:text-blue-600"
                            >
                                <BiEdit size={18} />
                            </button>
                            <button
                                onClick={() => deleteComment(c._id)}
                                className="text-red-500 hover:text-red-600"
                            >
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
                        className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-900"
                            }`}
                        rows="3"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            onClick={() => setEditMode(false)}
                            className="px-3 py-1 text-sm bg-blue-700 rounded hover:bg-blue-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={updateComment}
                            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {c.comment}
                </p>
            )}
        </div>
    );
};

export default Comment;
