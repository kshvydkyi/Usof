import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import route from "../api/route";
import { fetchPersonalPosts } from "../slices/postSlice";
import PostCategories from "./PostCategory";
import PostComents from "./PostComents";
import PostLikes from "./PostLikes";
import { getFetchStatus } from "../slices/postSlice";
import SpinnerLoading from "./Spinner";

const Pages = ({ totalPages }) => {
	let pages = [];
	for (let i = 1; i <= totalPages; i++) {
		pages.push(<li key={i}><a className='pages' href={`/posts/?page=${i}`}>{i}</a></li>)
	}
	return pages;
}
const User = () => {
    const currentUser = JSON.parse(localStorage.getItem('autorized'));
    const navigate = useNavigate();

    const isLoading = useSelector(getFetchStatus);

    const dispatch = useDispatch();
    const [login, setLogin] = useState();
    const [fullName, setFullName] = useState();
    const [email, setEmail] = useState();
    const [photo, setPhoto] = useState();
    const [rating, setRating] = useState();
    const [role, setRole] = useState();
    const [selfProfile, setSelfProfile] = useState();
    const totalPages = useSelector((state) => state.posts.personalCountPages);

    const { pathname } = useLocation();
    // const id = search.split('/');
    // console.log(pathname);
    const id = pathname.split('/');
    // console.log(id[2])
    const personalPosts = useSelector(state => state.posts.personalPosts)
    
    useEffect(() => {
        dispatch(fetchPersonalPosts({page: 1,id: id[2]}))
    }, []);
    console.log(personalPosts);
    const getUserInfo = async () => {
        try {
            const response = await axios.get(`/api/get-user/${id[2]}`);
            // console.log(response.data.values[0]);
            setSelfProfile(currentUser.userId === +id[2] ? true : false)
            setLogin(response.data.values[0].login);
            setFullName(response.data.values[0].full_name);
            setEmail(response.data.values[0].email);
            setPhoto(response.data.values[0].photo);
            setRole(response.data.values[0].role);
            setRating(response.data.values[0].rating);

        }
        catch (e) {
            console.log(e)
            navigate('/500');
        }
    }
    useEffect(() => {
        getUserInfo();
    }, []);


    return isLoading ? <SpinnerLoading style={{style: 'page-loading'}}/> : (
        <>
            <div className='user-page-userInfo'>
                <a href="/change-avatar">
                    <img src={photo && photo !== 'undefined' ? `${route.serverURL}/avatars/${photo}` : <></>} alt='user' width={120} height={120} />
                    </a>
                <div>
                    <p>Юзернейм: {login}</p>
                    <p>Ім'я: {fullName}</p>
                    <p>Емаіл: {email}</p>
                    <p>Роль: {role}</p>
                    <p>Рейтинг: {rating}</p>
                </div>

            </div>
            {selfProfile ? <div className='header-buttons'>
                <a className='header-user' href='/create-post'>Cтворити базу</a>
                <a className="header-user" href='/change-profile'>Редагувати профіль</a>
            </div> : <></>}
            <div className="posts-block">
			<div className='container-posts'>
				<ul>
					{personalPosts && personalPosts.map((post) => {
						const normalFormat = moment(post.publish_date, moment.defaultFormat).toDate();
						const formatedDate = moment(normalFormat).fromNow();
						return (
							<li className="none" key={post.id}>
								<div className="post-card">
									<div className='post-author-date-block'>
										<div className="post-author-info">
											{/* <img src={post.authorPhoto && post.authorPhoto !== 'undefined' ? `${route.serverURL}/avatars/${post.authorPhoto}` : <></>} className='header-avatar' alt={'author avatar'} /> */}
											{/* <a href={`/user/${post.authorId}`} className="post-author">{post.author}</a> */}
										</div>
										<p className="post-title">{post.title}</p>
										<p className='post-publish-date'>{formatedDate}</p>
									</div>
									<div className="post-title-img">
										{post.image && post.image !== 'undefined' ? <img src={`${route.serverURL}/post-pictures/${post.image}`} className="post-img" alt='admin eblan' /> : <></>}
									</div>
									<div className='post-desc'>
										<p className="post-content">{`${post.content}`}</p>
									</div>
									<div className="post-likes-comment-categories">
										<div className="flex-likes-comments">
											<PostLikes postId={post.id} />
											<PostComents postId={post.id} />
										</div>
										<PostCategories postId={post.id} />
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
			<div>
				<ul className="none inline">
					<Pages totalPages={totalPages} />
				</ul>
			</div>
		</div>
        </>
    )
}

export default User;