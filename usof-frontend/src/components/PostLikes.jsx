import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostLike } from '../slices/postSlice';
import likeInactive from '../assets/images/likes/likeInActivePicture.png'
import likeActive from '../assets/images/likes/likeActivePicture.png'
import likeInactiveWhite from '../assets/images/likes/likeInactiveWhite.png'
import likeActiveWhite from '../assets/images/likes/likeActiveWhite.png'
import randomInt from 'random-int';
const PostLikes = ({ postId }) => {
    const dispatch = useDispatch();
    const likes = useSelector((state) => state.posts.postLikes);
    useEffect(() => {
        dispatch(fetchPostLike(postId));

    }, []);
    // console.log(postId, likes)
    return (
        <>
        <ul className="none">
            {likes && likes[postId] !== undefined && likes[postId].map((like) => {
                return (
                    <>
                    <li>
                        <div className="likes-block">
                            <img className="img-like-com" src={likeInactiveWhite} alt='nolike' height={30} width={30}/> 
                            <p>{like}</p>
                            </div>
                        </li>
                    </>
                )

            })}
            </ul>
        </>
    )
}

export default PostLikes;