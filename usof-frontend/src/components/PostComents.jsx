import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostComments} from '../slices/postSlice';
import comentsWhite from '../assets/images/coments/commentWhite.png'

const PostComents = ({ postId }) => {
    const dispatch = useDispatch();
    const coments = useSelector((state) => state.posts.postComments);
    useEffect(() => {
        dispatch(fetchPostComments(postId));

    }, []);
    return (
        <>
            {coments && coments[postId] !== undefined && 
                    <>
                        <div className="likes-block">
                        <img className="img-like-com" src={comentsWhite} alt="coments" height={30} width={30}/>
                        <p>{coments[postId].countComments}</p>
                        </div>
                    </>
                

            }
        </>
    )
}

export default PostComents;