import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import route from '../api/route';
import logo from '../assets/images/navbar/logo.png'
import useAuth from '../hooks/useAuth';
import LogoutSvg from '../assets/images/navbar/logout-icon.png'
const LOGOUT = '/api/auth/logout/'
const checkToken = async (token, setAuth) => {
    try {
        const response = await axios.get(`/api/check-token/${token}`);
        console.log(response.data.status, response.data.values.message);
    }
    catch (e) {
        console.log(e);
        if (e?.response.data.status === 401) {
            setAuth(false);
        }
    }
}

const Header = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('autorized'));

    const [userAvatar, setUserAvatar] = useState();
    useEffect(() => {
        if (currentUser.currentUser !== 'guest') {
            if (auth) {
                checkToken(currentUser.accessToken, setAuth);
                if (currentUser) {
                    setAuth({ ...currentUser });
                } else {
                    setAuth(false);
                }
            }
        }
    }, []);
    const logout = async () => {
        try {

            const response = await axios.post(LOGOUT + currentUser.accessToken);
            // console.log(response.data);
            localStorage.removeItem('autorized');
            setAuth(false);
            navigate('/');

        }
        catch (e) {
            navigate('/500');
        }
    }

    const getUserInfo = async () => {
        try {
            const response = await axios.get(`/api/get-user/${currentUser.userId}`);
            // console.log('userAvatar', response);
            setUserAvatar(response.data.values[0].photo);
        }
        catch (e) {
            console.log(e)
            navigate('/500');
        }
    }
    useEffect(() => {
        if (currentUser.currentUser !== 'guest') {
            getUserInfo();
        }
    }, []);
    // console.log(userAvatar);
    return (
        <div className="wrapper-navbar">
            <nav className="navbar">
                <a className="w-8" href='/'><img src={logo} alt='logo' height={40} /></a>
                <a href='/posts/?page=1'>Базований</a>
                <div className='nav-bar-auth'>
                    {auth.user ? (
                        <>
                            <div className='header-character'>
                                <div className='header-person'>
                                    <a className='header-user' href={`/user/${currentUser.userId}`}>{currentUser.user}</a>
                                    <img src={userAvatar && userAvatar !== 'undefined' && userAvatar !== undefined ? `${route.serverURL}/avatars/${userAvatar}` : `${route.serverURL}/avatars/default_avatar.png`} className='header-avatar' alt='avatar' />
                                </div>
                                <div className='header-buttons'>
                                    <button className='logout-button' onClick={logout}><img src={LogoutSvg} className='logout-img' alt='logout'/></button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <a className='header-user' href="/login">Логін</a>
                            <a className='header-user' href="/registration">Реєстрація</a>
                        </>
                    )
                    }

                </div>

            </nav>
        </div>
    )
}
export default Header;