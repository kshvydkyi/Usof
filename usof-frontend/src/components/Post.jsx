import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import route from "../api/route";
import Comentaries from "./Comentaries";
import PostCategories from "./PostCategory";
import PostComents from "./PostComents";
import PostLikes from "./PostLikes";


const Post = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    // const id = search.split('/');
    // console.log(pathname);
    const id = pathname.split('/');

    const [author, setAuthor] = useState();
    const [authorImage, setAuthorImage] = useState();
    const [authorId, setAuthorId] = useState();

    const [postId, setPostId] = useState();
    const [title, setTitle] = useState();
    const [content, setContent] = useState();

    const [postImage, setPostImage] = useState();
    const [publishDate, setPublishDate] = useState();
    const [status, setStatus] = useState();

    // const [] = useState();

    const getPostInfo = async () => {
        try {
            const response = await axios.get(`/api/posts/${id[2]}`)
            // console.log(response.data.values.post[0]);
            console.log(response.data.values.post[0].id)
            setAuthorId(response.data.values.post[0].author_id);
            setAuthor(response.data.values.post[0].author);
            setAuthorImage(response.data.values.post[0].authorImage);

            setPostId(response.data.values.post[0].id);
            setTitle(response.data.values.post[0].title);
            setContent(response.data.values.post[0].content);

            setPostImage(response.data.values.post[0].image);

            const normalFormat = moment(response.data.values.post[0].publish_date, moment.defaultFormat).toDate();
            const formatedDate = moment(normalFormat).fromNow();
            setPublishDate(formatedDate);
            setStatus(response.data.values.post[0].status);


        }
        catch (e) {
            console.log(e);
            // navigate('/404');
        }
    }
    useEffect(() => {
        getPostInfo();
    }, []);
    // console.log(postId);
    return (
        <>
            <div className="post-card">
                <div className='post-author-date-block'>
                    <div className="post-author-info">
                        <img src={authorImage && authorImage !== 'undefined' ? `${route.serverURL}/avatars/${authorImage}` : <></>} className='header-avatar' alt={'author avatar'} />
                        <a href={`/user/${authorId}`} className="post-author">{author}</a>
                    </div>
                    <a href={`/post/${id[2]}`}>{title}</a>
                    <p className='post-publish-date'>{publishDate}</p>
                </div>
                <div className="post-title-img">
                    {postImage && postImage !== 'undefined' ? <img src={`${route.serverURL}/post-pictures/${postImage}`} className="post-img" alt='admin eblan' /> : <></>}
                </div>
                <div className='post-desc'>
                    <p className="post-content">{`${content}`}</p>
                </div>
                <div className="post-likes-comment-categories">
                    <div className="flex-likes-comments">
                        <PostLikes postId={id[2]} />
                        <a href={`/post/${id[2]}`}><PostComents postId={id[2]} /></a>
                    </div>
                    <PostCategories postId={id[2]} />
                </div>
                <Comentaries postId={id[2]} /> 
                
            </div>
        </>
    )
}
export default Post;