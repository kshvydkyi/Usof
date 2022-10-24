import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const UpdateComent = () => {
    const { pathname } = useLocation();
    // const id = search.split('/');
    // console.log(pathname);
    const id = pathname.split('/');
    const [updateComment, setUpdateComment] = useState();
    const [postId, setPostId] = useState();
    const currentUser = JSON.parse(localStorage.getItem('autorized'));

    const navigate = useNavigate();
    const createComent = async (e) => {
        e.preventDefault();
        try {
            console.log(updateComment);
            const response = await axios.patch(`/api/comments/${id[2]}/${currentUser.accessToken}`, JSON.stringify({ content: updateComment }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(response);
            navigate(`/post/${postId}`);
        }
        catch (err) {
            console.log(err);
            navigate('/500')
        }
    }

    const getUserInfo = async () => {
        try {
            const response = await axios.get(`/api/comments/${id[2]}`);
            console.log(response.data.values.comment[0].content);
            console.log(response);
            setUpdateComment(response.data.values.comment[0].content);
            setPostId(response.data.values.comment[0].post_id);
        }
        catch (e) {
            console.log(e)
            navigate('/500');
        }
    }
    useEffect(() => {
        getUserInfo();
    }, []);
    return (
        <>
                    <form onSubmit={createComent} className="create-coment-form">
                        <label htmlFor="change-coment"></label>
                        <textarea
                            type='text'
                            id="change-coment"
                            rows='1'
                            className='create-post-content create-coment-textarea'
                            value={updateComment}
                            onChange={(e) => setUpdateComment(e.target.value)}
                            required
                        />
                        <button className="btn add-coment-btn">Змінити коментар</button>
                    </form>
        </>
    )
}

export default UpdateComent;