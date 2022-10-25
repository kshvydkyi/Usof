import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import SpinnerLoading from "./Spinner";
import {useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const LOGIN_URL = '/api/auth/login';

const Login = () => {
    const { setAuth } = useAuth();
    const userRef = useRef();
    const errRef = useRef();

    const [isLoading, setLoading] = useState(false);

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/posts/?page=1'

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ login: user, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // console.log(response?.data.status, response?.data?.values);
            const accessToken = response?.data?.values.token;
            const role = response?.data?.values.role;
            const userId = response?.data?.values.userId;
            // console.log(userId);
            setAuth({ user, accessToken, role, userId});
            localStorage.setItem('autorized', JSON.stringify({user, accessToken, role, userId}))
            setUser('');
            setPwd('');
            setLoading(false);
            navigate(from, {replace: true});
            document.location.reload();
        }
        catch (err) {
            setLoading(false);
            if (!err?.response) {
                setErrMsg('Сервер спить');
            } else if (err.response.data.values.message === `User with login - ${user} does not exist`) {
                setErrMsg('Користувача з таким логіном не існує');
            }
            else if (err.response.data.values.message === 'Passwords do not match') {
                setErrMsg('Пароль не підходить');
            }
            else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();

        }

    }

    return (
                <section className='login'>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Вхід</h1>
                    <form onSubmit={handleSubmit}>
                        <label className="form_label" htmlFor="login">Логін:</label>
                        <input
                            type="text"
                            className="form__field"
                            id="login"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />
                        <label className="login-lbl" htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            className="form__field"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button className="login-btn" disabled={isLoading}>{isLoading ? <SpinnerLoading /> : 'Вхід'}</button>
                    </form>
                 
                    <p>
                        В тебе немає аккаунту? <a href="/registration">Зареєструватись</a>
                    </p>
                    
                    <p>
                        Забули пароль? <a href="/reset-password">Відновити пароль</a>
                    </p>
                </section>
    )
}

export default Login;