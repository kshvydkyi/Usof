import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import { fetchPostCategory, fetchPostsInCategory, getFetchStatus } from "../slices/postSlice";
import SpinnerLoading from "./Spinner";


const Category = () => {
    const currentUser = JSON.parse(localStorage.getItem('autorized'));
    // const isLoading = useSelector(getFetchStatus);
    const isLoading = false;
    const { pathname } = useLocation();
    const id = pathname.split('/');
    const [categoryTitle, setCategoryTitle] = useState();
    const [categoryDesc, setCategoryDesc] = useState();

    const dispatch = useDispatch();
    const categoryPosts = useSelector(state => state.posts.postInCategory)
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
        dispatch(fetchPostsInCategory({id: id[2], token: currentUser.accessToken}));
    }, [])

    return isLoading ? <SpinnerLoading style={{ style: 'page-loading' }} /> : (
        <>
            <div className="user-page">
                <div className="user-page-userInfo">
                    <h2>{categoryTitle}</h2>
                    <p>{categoryDesc}</p>
                </div>

            </div>
        </>
    )

}


export default Category;