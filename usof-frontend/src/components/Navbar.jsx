import { useState } from "react";
import { useEffect } from "react";
import axios from "../api/axios"

const Navbar = () => {

    const [categories, setCategories] = useState([]);
    const getCategories = async () => {
        try{
            const response = await axios.get('/api/categories');
            // console.log(response.data.values);
            setCategories(response.data.values);
        }
        catch(e){
            // console.log(e)
        }
    }
    useEffect(() => {
        getCategories();
    }, [])
    console.log(categories);
    return ( 
        <>   

            <ul className="navigation">
                {categories ? categories.map((category) => {
                    return(
                    <li  className="none" key={category.id}>
                        <a href={`/category/${category.id}`}>{category.title}</a>
                    </li>
                    )
                }) : <></>}
                
            </ul>
        </>
    )
}

export default Navbar;