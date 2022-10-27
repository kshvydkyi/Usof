import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SpinnerLoading from "./Spinner";


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const FULLNAME_REGEX = /^['а-яА-ЯїЇґҐіІєЄa-zA-Z\s]{2,24}$/;
const ChangeProfile = () => {
    const errRef = useRef();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('autorized'));
    const [errMsg, setErrMsg] = useState('');

    const [changedLogin, setChangedLogin] = useState('');
    const [validChangedLogin, setValidChangedLogin] = useState(false);
    
    const [changedFullName, setChangedFullName] = useState('');
    const [validChangedFullName, setValidChangedFullName] = useState(false);

    const [changedEmail, setChangedEmail] = useState('');
    const [validChangedEmail, setValidChangedEmail] = useState(false);
    
    const [image, setImage] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setValidChangedLogin(USER_REGEX.test(changedLogin));
    }, [changedLogin]);

    useEffect(() => {
        setValidChangedFullName(FULLNAME_REGEX.test(changedFullName));
    }, [changedFullName]);

    useEffect(() => {
        setValidChangedEmail(EMAIL_REGEX.test(changedEmail));
    }, [changedEmail]);


    const setHidden = () => {
        setTimeout(() => setErrMsg(''), 5000);
    }
  
    const UpdateUserData = async (e) => {
        e.preventDefault();
        try{
            setLoading(true);
            const response = await axios.patch(`/api/users/${user.userId}/${user.accessToken}`,JSON.stringify({login: changedLogin, email: changedEmail, full_name: changedFullName}), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            localStorage.setItem('autorized', JSON.stringify({accessToken: user.accessToken, role: user.role, user: changedLogin, userId: user.userId}))
            // console.log(response);
            setLoading(false);
            navigate(-1);
        }
        catch(err) {
            setLoading(false);
            if(err?.response.data.status === 409){
                setErrMsg('Такий логін або email вже існує');
                setHidden();
            }
            else if(err?.response.data.status === 404){
                navigate('/404');
            }
            else{
                navigate('/500')
            }
        }
    }
    const getUserInfo = async () => {
        try {
            const response = await axios.get(`/api/get-user/${user.userId}`);
            // console.log(response.data.values[0]);
            // console.log(response)
            setChangedLogin(response.data.values[0].login);
            setChangedFullName(response.data.values[0].full_name);
            setChangedEmail(response.data.values[0].email);
            // setPhoto(response.data.values[0].photo);
            // setRole(response.data.values[0].role);
            // setRating(response.data.values[0].rating);

        }
        catch (e) {
            console.log(e)
            if(e?.response.data.status === 404){
                navigate('/404');
            }
            else{
                navigate('/500');
            }
        }
    }
    useEffect(() => {
        getUserInfo();
    }, []);
    // const addImage = async (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     // console.log(selectedFile);
    //     formData.append("image", selectedFile);
    //     // console.log(formData);
    //     try {
    //         const response = await axios.post(`/api/posts/image/${user.accessToken}`, formData,
    //             {
    //                 headers: { "Content-Type": "multipart/form-data" },
    //                 withCredentials: true
    //             }

    //         )
    //         // console.log(response);
    //         setImage(response.data.values.path);
    //     }
    //     catch (err) {
    //         // console.log(err?.response);
    //         setErrMsg('Не вдалося завантажити картинку')
    //     }

    // }
    // const handleFileSelect = (e) => {
    //     setSelectedFile(e.target.files[0])
    // }
    return (
        <>
            <div className="create-post  change-prof">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Редагування профілю</h1>
                <div className='create-post-forms'>
                    <form onSubmit={UpdateUserData}>
                        <label className="form_label" htmlFor="change-login">Логін
                        <FontAwesomeIcon icon={faCheck} className={validChangedLogin ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validChangedLogin || !changedLogin ? "hide" : "invalid"} />
                            </label>
                        <input
                            type="text"
                            className="create-post-field"
                            id="change-login"
                            autoComplete="off"
                            onChange={(e) => setChangedLogin(e.target.value)}
                            value={changedLogin}
                        />
                        <label className="form_label" htmlFor="change-full-name">Ваше ім'я або нікнейм
                            <FontAwesomeIcon icon={faCheck} className={validChangedFullName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validChangedFullName || !changedFullName ? "hide" : "invalid"} />
                        </label>
                        <input
                            type='text'
                            id='change-full-name'
                            className='create-post-content'
                            autoComplete="off"
                            onChange={(e) => setChangedFullName(e.target.value)}
                            value={changedFullName}
                             />
                            <label className="form_label" htmlFor="change-email">Email
                            <FontAwesomeIcon icon={faCheck} className={validChangedEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validChangedEmail || !changedEmail ? "hide" : "invalid"} />
                            </label>
                            <input
                            type='text'
                            id='change-email'
                            className='create-post-content'
                            autoComplete="off"
                            onChange={(e) => setChangedEmail(e.target.value)}
                            value={changedEmail}
                             />
                        <button className="btn" disabled={!validChangedLogin || !validChangedEmail || !validChangedFullName || isLoading ? true : false}>{isLoading ? <SpinnerLoading /> : 'Змінити дані профілю'}</button>
                    </form>
                    {/* <div className="select-image">
                        <form onSubmit={addImage}>
                            <input
                                className="file-select"
                                type="file"
                                onChange={handleFileSelect} />
                            <button className="btn" disabled={selectedFile ? false : true}>Завантажити</button>
                        </form>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default ChangeProfile;