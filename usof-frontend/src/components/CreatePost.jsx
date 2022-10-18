import axios from "../api/axios";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useState } from "react";
import { useRef } from "react";
import Select from 'react-select'
const CREATE_POST = '/api/posts/'
const CreatePost = () => {
    const errRef = useRef();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('autorized'));

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
   
    const [errMsg, setErrMsg] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const options = [];
    const setHidden = () => {
        setTimeout(() => setErrMsg(''), 5000);
    }

   
 
    const addImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        console.log(selectedFile);
        formData.append("image", selectedFile);
        console.log(formData);
        try {
            const response = await axios.post(`/api/posts/image/${user.accessToken}`, formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true
                }

            )
            console.log(response);
            setImage(response.data.values.path);
        }
        catch (err) {
            console.log(err?.response);
        }

    }
    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0])
    }
    const categories = []
    const createPost = async (e) => {
        e.preventDefault();
        try {
            console.log(title, content, image, selectedValue);
            selectedValue.map((item) => {
                categories.push({category: item})
            })
            console.log(categories);
            const response = await axios.post(CREATE_POST + user.accessToken,
                JSON.stringify({ title: title, content: content, image: image, category: categories[0].category, category1: categories[1].category}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });

            console.log(response);
            // navigate('/posts/?page=1');
        }
        catch (err) {
            console.log(err)
            if (!err?.response) {
                setErrMsg('Сервер впав(')
                setHidden();
            }
            else if (err.response.data.values.message === `Post with title - ${title} already exist`) {
                setErrMsg("Пост з таким заголовком вже існує, оберіть інший")
                setHidden();
            }
            else {
                setErrMsg('шось сталось')
                setHidden();
            }
            errRef.current.focus();
        }
    }
    
    const getCategories = async () => {
        try {
            const response = await axios.get(`/api/categories/${user.accessToken}`);
            response.data.values.map((item) => {
                options.push({value: item.id, label: item.title});
            })
        }
        catch (err) {
            console.log(err);
        }
    }
    // useEffect(() => {
    //     getCategories();
    // });

    // const [selectedValue, setSelectedValue] = useState([]);
    // const handleChange = (e) => {
    //     setSelectedValue(Array.isArray(e) ? e.map(x => x.value) : []);
    //   }
    // console.log('options', options);
    const customStyles = {
        option: (provided, state) => ({
          ...provided,
          color: 'rgb(249 115 22)',
          backgroundColor: '#000',
          borderTop: '.1px solid',
          height: '100%',
        }),
        control: (base, state) => ({
          ...base,
          borderColor: 'rgb(254 215 170)',
        }),
        singleValue: (provided, state) => ({
          ...provided,
          color: 'white',
        }),
      };
      const data = [
        {
          value: 1,
          label: "category1"
        },
        {
          value: 2,
          label: "category2"
        },
        {
          value: 4,
          label: "php dlya daunov"
        },
        {
          value: 5,
          label: "Admin Category1"
        },
        {
          value: 6,
          label: "Admin Category2"
        }
      ];
      const [selectedValue, setSelectedValue] = useState([]);

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    setSelectedValue(Array.isArray(e) ? e.map(x => x.value) : []);
  }

    return (
        <>
        <div className="create-post">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Тут створюється база</h1>
            <div className='create-post-forms'>
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
        className="dropdown"
        placeholder="Select Option"
        value={data.filter(obj => selectedValue.includes(obj.value))} // set selected values
        options={data} // set list of the data
        onChange={handleChange} // assign onChange function
        isMulti
        isClearable
      />
                    {/* <Select 
                        styles={customStyles}
                        id="category"
                       
                        value={options.filter(obj => selectedValue.includes(obj.value))} // set selected values
                        options={options}
                        onChange={handleChange}
                        isMulti
                        isClearable // set list of the data
                         // assign onChange function
                        
                        /> */}
                        {selectedValue && <div style={{ marginTop: 20, lineHeight: '25px' }}>
                            <div><b>Selected Value: </b> {JSON.stringify(selectedValue, null, 2)}</div>
                        </div>}

                        {/* <input
                        type="number"
                        className="create-post-field"
                        id="category"
                        autoComplete="off"
                        // onChange={(e) => setCategory(e.target.value)}
                        // value={category}
                        required
                        min={1}
                        max={6}
                        aria-describedby="categorynote"

                    /> */}


                    <button className="btn">Запостити базу</button>
                </form>
                <div className="select-image">
                    <form onSubmit={addImage}>
                        <input
                        className="file-select"
                            type="file"
                            onChange={handleFileSelect} />
                            {/* <input disabled={image ? true : false} type="submit" className="btn" value="Завантажити картинку" /> */}
                            <button  className="button" disabled={selectedFile ? false : true}>Завантажити</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default CreatePost;