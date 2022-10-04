import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from '../context/AuthProvider';
import axios from '../api/axios';

const LOGIN_URL = '/api/auth/login';

const Login = () =>{
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ login: user, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data.status, response?.data?.values.token);
            const accessToken = response?.data?.values.token;
            console.log(accessToken);
            setAuth({ user, pwd, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
        }
        catch(err){
            if (!err?.response) {
                setErrMsg('Сервер спить');
            } else if (err.response.data.values.message === `User with login - ${user} does not exist`) {
                setErrMsg('Користувача з таким логіном не існує');
            } 
            else if (err.response.data.values.message === 'Passwords do not match'){
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
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="#">Go to Home</a>
                    </p>
                </section>
            ) : (
    <section>
    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
    <h1>Вхід</h1>
        <form onSubmit={handleSubmit}>
        <label htmlFor="login">Логін:</label>
        <input
            type="text"
            id="login"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            value={user}
            required
        />
          <label htmlFor="password">Пароль:</label>
        <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
        />
          <button>Вхід</button>
        </form>
        <p>
            В тебе немає аккаунту? <a href="/registration">Зареєструватись</a>
        </p>
        <p>
            Забули пароль? <a href="/reset-password">Відновити пароль</a>
        </p>
    </section>
    
        )}
    
        </>
    )
}

export default Login;