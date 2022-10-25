import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import route from "../api/route";
import { actions, fetchPostComments } from "../slices/postSlice";
import ComentsLikes from "./ComentsLike";
import deleteIcon from '../assets/images/buttons/delete.png'
import updateIcon from '../assets/images/buttons/updateIcon.png'


const Comentaries = ({ postId }) => {

    const currentUser = JSON.parse(localStorage.getItem('autorized'));
    const dispatch = useDispatch();
    const comentaries = useSelector((state) => state.posts.postComments);
    const [addComent, setAddComent] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        dispatch(fetchPostComments(postId));
    }, []);

    useEffect(() => {

    }, [comentaries])
    console.log(comentaries[postId]?.comments.coments);
    const createComent = async (e) => {
        e.preventDefault();
        try {
            console.log(addComent);
            const response = await axios.post(`/api/posts/${postId}/comments/${currentUser.accessToken}`, JSON.stringify({ content: addComent }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(response);
            document.location.reload();
            window.scrollTo(0, 700);
        }
        catch (err) {
            console.log(err);
            navigate('/500')
        }
    }
    const deleteComent = async (id) => {
        try{
            const response = await axios.delete(`/api/comments/${id}/${currentUser.accessToken}`);
            console.log(response);
            document.location.reload();
            window.scrollTo(0, 700);
        }
        catch (e){
            console.log(e);
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
                                        <div>
                                                {currentUser.userId === coment.authorId ? <>  <a href={`/update-coment/${coment.id}`}><img src={updateIcon} className="deleteBTN updateIcon" alt='delete post'/></a> <button className="noneBTN" onClick={() => deleteComent(coment.id)}><img src={deleteIcon} height={40} className="deleteBTN" alt='delete post'/></button></> : <></>}
                                             </div>
                                    </div>
                                    <div className='post-desc'>
                                    <p className="post-content coment-author">{`${coment.content}`}</p>
                                    </div>
                                    <div className="coment-delete-update">
                                        <ComentsLikes comentId={coment.id} />
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