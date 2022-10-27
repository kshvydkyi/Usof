import { useState } from "react";
import { useEffect } from "react";
import axios from "../api/axios"
const Categories = () => {

    const [categories, setCategories] = useState([]);
    const getCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            console.log(response.data.values);
            setCategories(response.data.values);
        }
        catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        getCategories();
    }, [])
    console.log(categories);
    return (
        <>
            <ul className="">
                {categories ? categories.map((category) => {
                    return (
                        <li className="none" key={category.id}>
                            <div className="post-card">
                                <div className="category-page-title">
                                    <h2>{category.title}</h2>
                                </div>
                                <div>
                                    <p>{category.description}</p>
                                </div>
                                <div className="see-posts-in-category">
                                    <a href={`/category/${category.id}?page=1`}>Передивитись пости</a>
                                </div>
                            </div>
                        </li>
                    )
                }) : <></>}

            </ul>
        </>
    )
}

export default Categories;