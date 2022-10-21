import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import route from "../api/route";

const LOGOUT = '/api/auth/logout/'

const User = () => {
    const currentUser = JSON.parse(localStorage.getItem('autorized'));
    const navigate = useNavigate();


    const [login, setLogin] = useState();
    const [fullName, setFullName] = useState();
    const [email, setEmail] = useState();
    const [photo, setPhoto] = useState();
    const [rating, setRating] = useState();
    const [role, setRole] = useState();
    const [selfProfile, setSelfProfile] = useState();


    const { pathname } = useLocation();
    // const id = search.split('/');
    // console.log(pathname);
    const id = pathname.split('/');
    // console.log(id[2])
    const getUserInfo = async () => {
        try {
            const response = await axios.get(`/api/get-user/${id[2]}`);
            // console.log(response.data.values[0]);
            setSelfProfile(currentUser.userId === +id[2] ? true : false)
            setLogin(response.data.values[0].login);
            setFullName(response.data.values[0].full_name);
            setEmail(response.data.values[0].email);
            setPhoto(response.data.values[0].photo);
            setRole(response.data.values[0].role);
            setRating(response.data.values[0].rating);

        }
        catch (e) {
            console.log(e)
            navigate('/500');
        }
    }
    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <>
            <div className='user-page-userInfo'>
                <img src={photo && photo !== 'undefined' ? `${route.serverURL}/avatars/${photo}` : <></>} alt='user' height={120} />
                <div>
                    <p>Юзернейм: {login}</p>
                    <p>Ім'я: {fullName}</p>
                    <p>Емаіл: {email}</p>
                    <p>Роль: {role}</p>
                    <p>Рейтинг: {rating}</p>
                </div>

            </div>
            {selfProfile ? <div className='header-buttons'>
                <a className='header-user' href='/create-post'>Cтворити базу</a>

            </div> : <></>}
        </>
    )
}

export default User;