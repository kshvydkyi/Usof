import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, getFetchStatus, selectors } from '../slices/postSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/uk';
import route from '../api/route';
import PostCategories from "./PostCategory";
import PostLikes from "./PostLikes";
import PostComents from "./PostComents";
import SpinnerLoading from "./Spinner";
import ReadMoreReact from 'read-more-react';
import Navbar from "./Navbar";
const Pages = ({ totalPages }) => {
	let pages = [];
	for (let i = 1; i <= totalPages; i++) {
		pages.push(<li key={i}><a className='pages' href={`/posts/?page=${i}`}>{i}</a></li>)
	}
	return pages;
}
const Posts = () => {
	const isLoading = useSelector(getFetchStatus);
	const navigate = useNavigate();
	const { search } = useLocation();
	const page = search.split('=');
	const dispatch = useDispatch();
	const posts = useSelector(selectors.selectAll);
	const totalPages = useSelector((state) => state.posts.countPages);
	// const categories = useSelector((state) => state.posts.postCategories);
	useEffect(() => {
		if (page[0] !== '?page') {
			navigate('/not-found');
		}
		dispatch(fetchPosts(page[1]));
	}, []);
	// console.log('Post:', posts);
	// console.log('post categories', categories)
	return isLoading ? <SpinnerLoading style={{ style: 'page-loading' }} /> : (
		<div className="posts-block">
		
			<div className='container-posts'>
			{/* <Navbar /> */}
				<ul className="ul-posts">
					{posts && posts.map((post) => {
						const normalFormat = moment(post.publish_date, moment.defaultFormat).toDate();
						const formatedDate = moment(normalFormat).fromNow();
						return (
							<li className="none" key={post.id}>
								<div className="post-card">
									<div className='post-author-date-block'>
										<div className="post-author-info">
											<img src={post.authorPhoto && post.authorPhoto !== 'undefined' ? `${route.serverURL}/avatars/${post.authorPhoto}` : <></>} className='header-avatar' alt={'author avatar'} />
											<a href={`/user/${post.authorId}`} className="post-author">{post.author}</a>
										</div>
										<a href={`/post/${post.id}`}>{post.title}</a>
										<p className='post-publish-date'>{formatedDate}</p>
									</div>
									<div className="post-title-img">
										{post.image && post.image !== 'undefined' ? <img src={`${route.serverURL}/post-pictures/${post.image}`} className="post-img" alt='admin eblan' /> : <></>}
									</div>
									<div className='post-desc'>
								
										<p className="post-content">{post.content.length < 100 ? post.content 
                                        : <>
                                        {post.content.slice(0, 100)} 
                                        <a href={`/post/${post.id}`} target={`_blank`}> ...</a>
                                        </>}</p>
									</div>
									<div className="post-likes-comment-categories">
										<div className="flex-likes-comments">
											<PostLikes postId={post.id} />
											<a href={`/post/${post.id}`}><PostComents postId={post.id} /></a>
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

	);
}
export default Posts;