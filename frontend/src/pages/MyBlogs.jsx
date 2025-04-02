import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { URL } from "../url";
import HomePosts from "../components/HomePosts";
import Loader from "../components/Loader";

const MyBlogs = () => {
    const { search } = useLocation();
    const [posts, setPosts] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [loader, setLoader] = useState(false);
    const { user } = useContext(UserContext);

    const fetchPosts = async () => {
        if (!user?._id) return;

        setLoader(true);
        try {
            const res = await axios.get(`/api/posts/user/${user._id}`, {
                withCredentials: true
            });

            setPosts(res.data.data);
            setNoResults(res.data.data.length === 0);
        } catch (err) {
            console.error("Error fetching user's posts:", err);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [search, user?._id]);

    return (
        <div className="px-8 md:px-[200px] min-h-[80vh]">
            {loader ? (
                <div className="h-[40vh] flex justify-center items-center">
                    <Loader />
                </div>
            ) : noResults ? (
                <h3 className="text-center font-bold mt-16">No posts available</h3>
            ) : (
                posts.map((post) => (
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
                ))
            )}
        </div>
    );
};

export default MyBlogs;
