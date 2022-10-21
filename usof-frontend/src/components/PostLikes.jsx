import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostLike } from '../slices/postSlice';
// import likeInactive from '../assets/images/likes/likeInActivePicture.png'
// import likeActive from '../assets/images/likes/likeActivePicture.png'
import likeInactiveWhite from '../assets/images/likes/likeInactiveWhite.png'
import likeActiveWhite from '../assets/images/likes/likeActiveWhite.png'
// import randomInt from 'random-int';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const PostLikes = ({ postId }) => {
    const [isLike, setIsLike] = useState(false);
    const [countLikes, setCountLikes] = useState();
    const dispatch = useDispatch();
    const likes = useSelector((state) => state.posts.postLikes);
    const likesInfo = useSelector((state) => state.posts.likesInfo);
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('autorized'));
    useEffect(() => {
        dispatch(fetchPostLike(postId));
    }, []);

    useEffect(() => {
        setCountLikes(likes[postId]);
    }, [likes])
    // console.log(countLikes);
    useEffect(() => {
        if (likesInfo[postId] !== undefined) {
            likesInfo[postId].map((like) => {
                if (like.author_id === userInfo.userId) {
                    setIsLike(true);
                }

            })
        }
    }, [likesInfo[postId]])
    const createDeleteLike = async () => {
        try {
            if (isLike) {
                const deleteLike = await axios.delete(`/api/posts/${postId}/like/${userInfo.accessToken}`);
                setIsLike(false);
                setCountLikes(countLikes - 1);
                // console.log(deleteLike);
            }
            else {
                const createLike = await axios.post(`/api/posts/${postId}/like/${userInfo.accessToken}`);
                setIsLike(true);
                setCountLikes(countLikes + 1);
            }
        }
        catch (e) {
            console.log(e);
            navigate('/500');
        }
    }
    return (
        <>
            <ul className="none">
                {likes && likes !== undefined ?

                    <li>
                        <div className="likes-block">
                            <button onClick={createDeleteLike} className="like-create-delete"><img className="img-like-com" src={isLike ? likeActiveWhite : likeInactiveWhite} alt='nolike' height={30} width={30} /></button>
                            <p>{countLikes}</p>
                        </div>
                    </li>



                    : <></>}

            </ul>
        </>
    )
}

export default PostLikes;