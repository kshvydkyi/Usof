import axios from "../api/axios";
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useState } from "react";
import { useRef } from "react";
import Select from 'react-select'
import { useDispatch, useSelector } from "react-redux";
import { fetchPostCategory } from "../slices/postSlice";
const CREATE_POST = '/api/posts/'
const UpdatePost = () => {
    const errRef = useRef();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('autorized'));
    const {pathname} = useLocation();
    const id = pathname.split('/');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [selectedValue, setSelectedValue] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const options = [];
    const postCategories = useSelector((state) => state.posts.postCategories);
    // //console.log('afdadsa',postCategories)
    const dispatch = useDispatch();
    const setHidden = () => {
        setTimeout(() => setErrMsg(''), 5000);
    }
    const getPostInfo = async () => {
        try{
            const response = await axios.get(`/api/posts/${id[2]}`);
            setTitle(response.data.values.post[0].title);
            setContent(response.data.values.post[0].content);
        }
        catch(e){
            //console.log(e);
            if(e?.response.status === 404){
                navigate('/404')
            }
            else if(e?.response.status === 404){
                navigate('/404')
            }
        }
    }
    // //console.log(options)
    // //console.log(postCategories)
    useEffect(() => {
        getPostInfo();
        dispatch(fetchPostCategory(id[2]))
    }, [])


    const updateImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // //console.log(selectedFile);
        formData.append("image", selectedFile);
        // //console.log(formData);
        try {
            const response = await axios.patch(`/api/posts/update/image/${id[2]}/${user.accessToken}`, formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true
                }

            )
            //console.log(response.data.values.path);
            setImage(response.data.values.path);
        }
        catch (err) {
            //console.log(err?.response);
            setErrMsg('Не вдалося завантажити картинку')
        }

    }
    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0])
    }
    const categories = {}
    const updatePost = async (e) => {
        e.preventDefault();
        try {
            //console.log(title, content, image, selectedValue);
            selectedValue.map((item) => {
                categories[item.label] = item.value;
            })
            ////console.log(categories);
            const updateTitleDesc = await axios.patch(`/api/posts/${id[2]}/${user.accessToken}`, JSON.stringify({title: title, content: content, image: image}), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            //console.log(updateTitleDesc);
            const updateCategories = await axios.patch(`/api/posts/update-category/${id[2]}/${user.accessToken}`, JSON.stringify(categories),
            {headers: { 'Content-Type': 'application/json' },
            withCredentials: true})
            //console.log(updateCategories);
            // //console.log(categories[0].category.value);
        }
        catch (err) {
            // //console.log(err)
            if (!err?.response) {
                setErrMsg('Сервер впав(')
                setHidden();
            }
            else if (err.response.data.values.message === `Post with title - ${title} already exist`) {
                setErrMsg("Пост з таким заголовком вже існує, оберіть інший")
                setHidden();
            }
            else {
                setErrMsg('шось сталось, перелогіньтесь будь ласка')
                setHidden();
            }
            errRef.current.focus();
        }
    }
    const [kostyl, setKostyl] = useState(0);
    const getCategories = async () => {
        try {
            const response = await axios.get(`/api/categories`);
            response.data.values.map((item) => {
                options.push({ value: item.id, label: item.title });
            })
            const filterCategories = Object.values(postCategories)[0]?.map(
                (item) => {
                    // //console.log(item[0].id);
                    // // setTestState((prefState) => 
                    //     [prefState,  options[item[0].id]]
                    // )
                    // //console.log(testState);
                    const searchOption = options.find(i => i.value === item[0].id)
                    return searchOption;
                }
                
              );
            //   //console.log(filterCategories);
              if(10 > kostyl){
                setSelectedValue(filterCategories);
                setKostyl(kostyl + 1);
              }
        }
        catch (err) {
        //    //console.log (err);
            navigate('/500');
        }
    }
    useEffect(() => {
        getCategories();
        // //console.log('options', options);
    }, [options]);
 
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'none',
            boxShadow: state.isFocused ? `0 0 0 2px rgb(90, 20, 152), 0 0 #0000` : '',
            transition: 'box-shadow 0.1s ease-in-out',
          }),
      
          placeholder: (provided) => ({
            ...provided,
            color: '#9CA3AF',
          }),
      
          input: (provided) => ({
            ...provided,
            color:  '#E5E7EB',
          }),
      
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
              ? 'rgb(90, 20, 152)'
              : 'transparent',
              backgroundColor: state.isOptionDisabled ?  'rgb(90, 20, 152)' : 'transparent',
              transition: '0.3s',
            color: '#E5E7EB',
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: 'rgb(90, 20, 152)',
            color: 'white'
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: 'white'
          }),
          multiValueRemove: (provided, state) => ({
            ...provided,
            backgroundColor: state.isHover ? '': 'rgb(45, 45, 45)',
            transition: '0.2s'
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: 'rgb(45, 45, 45)',
          }),
    }
    return (
        <>
            <div className="create-post">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Тут редагується база</h1>
                <div className='create-post-forms'>
                    <form onSubmit={updatePost}>
                        <label className="form_label" htmlFor="title">Заголовок</label>
                        <input
                            type="text"
                            className="create-post-field"
                            id="title"
                            autoComplete="off"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            aria-describedby="titlenote"
                            maxLength="40"
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
                        <label className="form_label" htmlFor="category">Категорія бази</label>
                        <Select
                            styles={customStyles}
                            placeholder="Виберіть категорії"
                            // value={options.filter(obj => options.includes(obj.value))} 
                            defaultValue={[options[0]]}
                            value={selectedValue}// set selected values
                            options={options}
                            isOptionDisabled={() => selectedValue.length >= 3} // set list of the data
                            onChange={(option) => {
                                // //console.log(option);
                                setSelectedValue(option);
                            }} // assign onChange function
                            isMulti
                            // isClearable
                        />
                        <button className="btn">Змінти базу</button>
                    </form>
                    <div className="select-image">
                        <form onSubmit={updateImage}>
                            <input
                                className="file-select"
                                type="file"
                                onChange={handleFileSelect} 
                                accept="image/jpeg,image/png"
                                />
                            <button className="btn" disabled={selectedFile ? false : true}>Завантажити</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdatePost;