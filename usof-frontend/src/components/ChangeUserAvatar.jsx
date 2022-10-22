import axios from "../api/axios";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useState } from "react";
import { useRef } from "react";
import Select from 'react-select';


const ChangeUserAvatar = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [image, setImage] = useState('');
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const user = JSON.parse(localStorage.getItem('autorized'));
    const navigate = useNavigate();
    const addImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // console.log(selectedFile);
        formData.append("image", selectedFile);
        // console.log(formData);
        try {
            const response = await axios.patch(`/api/users/avatar/${user.accessToken}`, formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true
                }

            )
            // console.log(response);
            setImage(response.data.values.path);
            navigate('/posts/?page=1');
        }
        catch (err) {
            console.log(err);
            setErrMsg('Не вдалося завантажити картинку')
        }

    }
    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0])
    }

    return(

      <> 
    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>   
    <div className="select-image">
        <form onSubmit={addImage}>
            <input
                className="file-select"
                type="file"
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/jpg"
            />
            <button className="btn" disabled={selectedFile ? false : true}>Завантажити</button>
        </form>
    </div>
    </> 
    )
}

export default ChangeUserAvatar;