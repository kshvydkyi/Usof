import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import route from "../api/route";
import { fetchPostCategory, fetchPostsInCategory, getFetchStatus } from "../slices/postSlice";
import PostCategories from "./PostCategory";
import PostComents from "./PostComents";
import PostLikes from "./PostLikes";
import SpinnerLoading from "./Spinner";

const Pages = ({ totalPages, categoryId }) => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(<li key={i}><a className='pages' href={`/category/${categoryId}?page=${i}`}>{i}</a></li>)
    }
    return pages;
}
const Category = () => {
    const currentUser = JSON.parse(localStorage.getItem('autorized'));
    // const isLoading = useSelector(getFetchStatus);
    const isLoading = false;
    const { search, pathname } = useLocation();
    const id = pathname.split('/');
    const page = search.split('=');
    const [categoryTitle, setCategoryTitle] = useState();
    const [categoryDesc, setCategoryDesc] = useState();

    const dispatch = useDispatch();
    const categoryPosts = useSelector(state => state.posts.postInCategory)
    const totalPages = useSelector(state => state.posts.postInCategoryPages)
    console.log(categoryPosts);
    const getCategoryInfo = async () => {
        try {
            const response = await axios.get(`/api/categories/${id[2]}`)
            console.log(response.data.values[0].title);
            setCategoryTitle(response.data.values[0].title);
            setCategoryDesc(response.data.values[0].description)
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getCategoryInfo();
    }, [])


    useEffect(() => {
        dispatch(fetchPostsInCategory({page: page[1], id: id[2], token: currentUser.accessToken}));
    }, [])

    return isLoading ? <SpinnerLoading style={{ style: 'page-loading' }} /> : (
        <>
            <div className="user-page">
                <div className="user-page-userInfo">
                    <h2 className="category-title">{categoryTitle}</h2>
                    <p>{categoryDesc}</p>
              

            </div>
            <div className="posts-block">
		
			<div className='container-posts'>
			{/* <Navbar /> */}
				<ul className="ul-posts">
					{categoryPosts && categoryPosts.length > 0 ? categoryPosts.map((post) => {
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
					}) : <></>}
				</ul>
			</div>
			<div>
				<ul className="none inline">
					<Pages totalPages={totalPages} categoryId={id[2]} />
				</ul>
			</div>
		</div>
        </div>
        </>
    )

}


export default Category;