import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { URL } from "../url.js";
import { Link, useNavigate } from "react-router-dom";


const Menures = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await axios.get(`/api/auth/logout`, { withCredentials: true })
            setUser(null)
            navigate("/login")
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleCreatePost = () => {
        navigate("/write"); // Using the same route path as typically used for blog creation
    }

    return (
        <div className="bg-black w-[200px] z-10 flex flex-col items-start absolute top-12 right-6 md:right-32 rounded-md p-4 space-y-4">
            {!user && <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer"><Link to="/login">Login</Link></h3>}
            {!user && <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer"><Link to="/register">Register</Link></h3>}
            {user && <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer"><Link to="/write">Create Blog</Link></h3>}
            {user && <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer"><Link to={"/profile/" + user._id}>Profile</Link></h3>}
            {user && <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer"><Link to={"/myblogs/" + user._id}>My blogs</Link></h3>}
            {user && <h3 onClick={handleLogout} className="text-white text-sm hover:text-gray-500 cursor-pointer">Logout</h3>}

        </div>
    )
};

export default Menures;