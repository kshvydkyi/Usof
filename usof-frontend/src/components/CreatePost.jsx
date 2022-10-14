import axios from "../api/axios";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useState } from "react";
import { useRef } from "react";

const CREATE_POST = '/api/posts/'
const CreatePost = () => {
    const errRef = useRef();

    const {auth, setAuth} = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [titleFocus, setTitleFocus] = useState(false);


    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');

    const [errMsg, setErrMsg] = useState('');
    useEffect(()=>{
        if(auth){
            const currentUser = JSON.parse(localStorage.getItem('autorized'));
            if(currentUser){
                setAuth({...currentUser});
            }else{
                setAuth(false);
            }
            
        }
    }, []);
    const getCategories = async () => {
        try{
            const response = await axios.get('/api/categories/' + auth.accessToken);
            console.log(response.data);
        }
        catch (err){
            console.log(err);
        }
    }
    // getCategories();
    const setHidden = () =>{
        setTimeout(()=> setErrMsg(''), 5000);
    }
    const createPost = async (e) =>{
        e.preventDefault();
        try{
            console.log(title, content, category);
            const response = await axios.post(CREATE_POST + auth.accessToken, 
                JSON.stringify({title: title, content: content, image: image, category1: category }), 
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                } );
            
            console.log(response);
        }
        catch(err){
            console.log(err.response.data)
            if(!err?.response){
                setErrMsg('Сервер впав(')
                setHidden();   
            }
            else if(err.response.data.values.message === `Post with title - ${title} already exist`){
                setErrMsg("Пост з таким заголовком вже існує, оберіть інший")
                setHidden();
            }
            else{
                setErrMsg('шось сталось')
                setHidden();
            }
            errRef.current.focus();
        }
    }
  
    return(
        <div className="create-post">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Тут створюється база</h1>
            <form onSubmit={createPost}>
            <label className="form_label" htmlFor="title">Заголовок</label>
                        <input
                            type="text"
                            className="create-post-field"
                            id="title"
                            autoComplete="off"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            aria-describedby="titlenote"
                            onFocus={() => setTitleFocus(true)}

                            required
                        />
                    <label className="form_label" htmlFor="content">Опис бази</label>
                    <textarea 
                        id='content'
                        className='create-post-content'
                        autoComplete="off"
                        rows='6'
                        cols='60'
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        aria-describedby="contentnote"
                        // wrap="off"
                        required
                    >
                    </textarea>
                    <label className="form_label" htmlFor="image">Як виглядає ваша база?</label>
                    <input
                            type="file"
                            className="create-post-field"
                            id="image"
                            autoComplete="off"
                            onChange={(e) => setImage(e.target.value)}
                            value={image}
                            
                            
                        />
                        <label className="form_label" htmlFor="category">Категорія бази</label>
                        <input
                            type="number"
                            className="create-post-field"
                            id="category"
                            autoComplete="off"
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                            required
                            min={1}
                            max={6}
                            aria-describedby="categorynote"

                            
                            
                        />
                
                <button>Запостити базу</button>
            </form>
        </div>
    )
}

export default CreatePost;