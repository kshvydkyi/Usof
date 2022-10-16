import { useQuery } from 'react-query';
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectors } from '../slices/postSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import route from '../api/route';

const Pages = ({totalPages}) =>{
	let pages = [];
	for(let i = 1; i <= totalPages; i++){
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
	useEffect(() => {
		if (page[0] !== '?page') {
			navigate('/not-found');
		}
		dispatch(fetchPosts(page[1]));

	}, []);
	console.log(posts);
	return (
		<div className="posts-block">
			<h2>Posts</h2>
			<div className='container-posts'>
			<ul>
				{posts && posts.map((post) => {
					const normalFormat = moment(post.publish_date, moment.defaultFormat).toDate();
					const formatedDate = moment(normalFormat).fromNow();

					return (
						<li className="none" key={post.id}>
							<div className="post-card">
								<h2 className="post-title">{post.title}</h2>
								<p className="post-author">{post.author}</p>
								{post.image && post.image !== 'undefined' ? <img src={`${route.serverURL}/post-pictures/${post.image}`} height={500} width={700} alt='admin eblan'/> : <></>}
								<p className="post-body">{post.content}</p>
								<p>{formatedDate}</p>
							</div>
						</li>
					);
				})}
			</ul>
			</div>
			<div>
				<ul className="none inline">
					<Pages totalPages={totalPages}/>
				</ul>
			</div>
		</div>

	);
}
export default Posts;