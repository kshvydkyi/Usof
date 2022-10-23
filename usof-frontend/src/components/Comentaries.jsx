import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../api/axios";
import route from "../api/route";
import { fetchPostComments } from "../slices/postSlice";


const Comentaries = ({ postId }) => {

    const currentUser = JSON.parse(localStorage.getItem('autorized'));
    const dispatch = useDispatch();
    const comentaries = useSelector((state) => state.posts.postComments);
    const [addComent, setAddComent] = useState();
    useEffect(() => {
        dispatch(fetchPostComments(postId));
    }, []);
    // console.log(comentaries[postId]?.comments.coments);
    const createComent = async (e) => {
        e.preventDefault();
        try{
            console.log(addComent);
            const response = await axios.post(`/api/posts/${postId}/comments/${currentUser.accessToken}`, JSON.stringify({content: addComent}), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(response);
        }
        catch(err){
            console.log(err);
        }
    }
    return (
        <>
        {currentUser.currentUser !== 'guest' ? 
        <>
            <form onSubmit={createComent} className="create-coment-form">
                <label htmlFor="add-coment"></label>
                <textarea 
                type='text'
                id="add-coment"
                rows='1'
                className='create-post-content create-coment-textarea'
                value={addComent}
                onChange={(e) => setAddComent(e.target.value)}
                required                    
                />
                <button className="btn add-coment-btn">Додати коментар</button>
            </form>
        </> 
        : <></>}
            <ul>
                {comentaries ? comentaries[postId]?.comments.coments.map((coment) => {
                    const normalFormat = moment(coment.publish_date, moment.defaultFormat).toDate();
                    const formatedDate = moment(normalFormat).fromNow();
                    return (
                        <>
                            <li className="none">
                                <div className="coment-card">
                                    <div className='coment-author-date-block'>
                                        <div className="coment-author-info">
                                            <img src={coment.authorImage && coment.authorImage !== 'undefined' ? `${route.serverURL}/avatars/${coment.authorImage}` : <></>} className='header-avatar coment-avatar' alt={'author avatar'} />
                                            <a href={`/user/${coment.authorId}`} className="post-author coment-author">{coment.author}</a>
                                            <p className='post-publish-date coment-date'>{formatedDate}</p>
                                        </div>
                                    </div>
                                    <div className='post-desc'>
										<p className="post-content coment-author">{`${coment.content}`}</p>
									</div>
                                </div>
                            </li>
                        </>
                    )
                }) : <></>}
            </ul>
        </>
    )

}


export default Comentaries;