import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import logo from '../assets/images/navbar/logo.png'
import useAuth from '../hooks/useAuth';

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
    useEffect(() => {
        // setAuth(false)
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
            console.log(response.data);
            localStorage.removeItem('autorized');
            setAuth(false);
            navigate('/');

        }
        catch (e) {
            navigate('/500');
        }
    }
    return (
        <div className="wrapper-navbar">
            <nav className="navbar">
                <a className="w-8" href='/'><img src={logo} alt='logo' height={40} /></a>
                <a href='/posts/?page=1'>Базований</a>
                <div className='nav-bar-auth'>
                    {auth.user ? (
                        <>
                            
                            <a className='header-user' href='/'>{currentUser.user}</a>
                            <a className='header-user' href='/create-post'>Cтворити базу</a>
                            <button className='header-user' onClick={logout}>Вийти</button>
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