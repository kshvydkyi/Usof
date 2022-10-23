import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostCommentsLikes } from '../slices/postSlice';
// import likeInactive from '../assets/images/likes/likeInActivePicture.png'
// import likeActive from '../assets/images/likes/likeActivePicture.png'
import likeInactiveWhite from '../assets/images/likes/likeInactiveWhite.png'
import likeActiveWhite from '../assets/images/likes/likeActiveWhite.png'
// import randomInt from 'random-int';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ComentsLikes = ({ comentId }) => {
    const [isLike, setIsLike] = useState(false);
    const [countLikes, setCountLikes] = useState();
    const dispatch = useDispatch();
    const likes = useSelector((state) => state.posts.postCommentsLikes);
    const likesInfo = useSelector((state) => state.posts.postCommentsLikesInfo);
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('autorized'));
    useEffect(() => {
        dispatch(fetchPostCommentsLikes(comentId));
    }, []);

    useEffect(() => {
        setCountLikes(likes[comentId]);
    }, [likes])
    // console.log(countLikes);
    useEffect(() => {
        if (likesInfo[comentId] !== undefined) {
            likesInfo[comentId].map((like) => {
                if (like.author_id === userInfo.userId) {
                    setIsLike(true);
                }

            })
        }
    }, [likesInfo[comentId]])
    const createDeleteLike = async () => {
        try {
            if (isLike) {
                const deleteLike = await axios.delete(`/api/comments/${comentId}/like/${userInfo.accessToken}`);
                setIsLike(false);
                setCountLikes(countLikes - 1);
                // console.log(deleteLike);
            }
            else {
                const createLike = await axios.post(`/api/comments/${comentId}/like/${userInfo.accessToken}`);
                setIsLike(true);
                setCountLikes(countLikes + 1);
                // console.log(createLike)
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
                            <button onClick={createDeleteLike} className="like-create-delete "><img className="img-like-com coment-like" src={isLike ? likeActiveWhite : likeInactiveWhite} alt='nolike' height={30} width={30} /></button>
                            <p>{countLikes}</p>
                        </div>
                    </li>



                    : <></>}

            </ul>
        </>
    )
}

export default ComentsLikes;