import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostComments, fetchPostLike, fetchPostCategory, fetchPosts, selectors } from '../slices/postSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/uk';
import route from '../api/route';
import PostCategories from "./PostCategory";
import PostLikes from "./PostLikes";
import PostComents from "./PostComents";

const Pages = ({ totalPages }) => {
	let pages = [];
	for (let i = 1; i <= totalPages; i++) {
		pages.push(<li key={i}><a className='pages' href={`/posts/?page=${i}`}>{i}</a></li>)
	}
	return pages;
}
const Posts = () => {

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
	// console.log('Post:', posts, 'categories', categories);
	// console.log('post categories', categories)
	return (
		<div className="posts-block">
			<div className='container-posts'>
				<ul>
					{posts && posts.map((post) => {
						const normalFormat = moment(post.publish_date, moment.defaultFormat).toDate();
						const formatedDate = moment(normalFormat).fromNow();
						// dispatch(fetchPostCategory(post.id));
						return (
							<li className="none" key={post.id}>
								<div className="post-card">
									<div className='post-author-date-block'>
										<a href='/' className="post-author">{post.author}</a>
										<p className="post-title">{post.title}</p>
										<p className='post-publish-date'>{formatedDate}</p>
									</div>
									<div className="post-title-img">
										{post.image && post.image !== 'undefined' ? <img src={`${route.serverURL}/post-pictures/${post.image}`} className="post-img"  alt='admin eblan' /> : <></>}
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

	);
}
export default Posts;