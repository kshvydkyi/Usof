
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostCategory } from '../slices/postSlice';


const PostCategories = ({ postId }) => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.posts.postCategories);
    useEffect(() => {
        dispatch(fetchPostCategory(postId));
        
    }, []);
    return (
        <>
            <ul className="none categories">
                {categories && categories[postId] !== undefined &&  categories[postId].map((category) => {
                    return (
                        <>
                            <li className='each-category'key={category[0].title}>
                                <a href={`/category/${category[0].id}`}>{category[0].title}</a>
                            </li>
                        </>
                    )

                })}
            </ul>
        </>
    )
}

export default PostCategories;