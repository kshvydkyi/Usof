import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import logo from '../assets/images/navbar/logo.png'
import useAuth from '../hooks/useAuth';

const LOGOUT = '/api/auth/logout/'
const Header = () =>{
    const {auth, setAuth} = useAuth();
    const navigate = useNavigate();
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
   
    const logout = async () =>{
        try{
            const response = await axios.post(LOGOUT + auth.accessToken);
            console.log(response.data);
            localStorage.removeItem('autorized');
            setAuth(false);
            navigate('/');
            
        }
        catch(e){
            navigate('/500');
        }
    }
    return (
        <div className="wrapper-navbar">
        <nav className="navbar">
            <a href='/'><img src={logo} alt='logo' height={40}/></a>
            <a href='/posts/?page=1'>Базований</a>
            <div className='nav-bar-auth'>
                {auth ? (
                <>
                    <button onClick={logout}>Вийти</button> 
                    <a href='/create-post'>Cтворити базу</a>
                </>
                ) : (
                <>
                <a href="/login">Логін</a>
                <a href="/registration">Реєстрація</a>
                </>
                )
                }
               
            </div>
            
        </nav>
        </div>
    )
}
export default Header;