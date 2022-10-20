import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import SpinnerLoading from "./Spinner";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const FULLNAME_REGEX = /^['а-яА-ЯїЇґҐіІa-zA-Z\s]{2,24}$/
const REGISTER_URL = '/api/auth/registration';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [fullName, setFullName] = useState('');
    const [validFullName, setValidFullName] = useState(false);
    const [fullNameFocus, setFullNameFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidFullName(FULLNAME_REGEX.test(fullName));
    }, [fullName]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        const v4 = FULLNAME_REGEX.test(fullName);
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ login: user, email: email, fullName: fullName, password: pwd, passwordConfirmation: matchPwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // console.log(response?.data.status, response?.data.values.message);
            setSuccess(true);
            setLoading(false);
        }
        catch (err) {
            setLoading(false);
            if (!err?.response) {
                setErrMsg('Сервер спить, вибачте');
            }
            else if (err.response.data.values.message === `User with login - ${user} already exist`) {
                setErrMsg('Такий логін вже існує');
            }
            else if (err.response.data.values.message === `Email - ${email} invalid`) {
                setErrMsg('Якийсь дивний email');
            }
            else if (err.response.data.values.message === `User with email - ${email} already exist`) {
                setErrMsg('Цей email вже використовується');
            } else {
                setErrMsg('Шось не так');
            }
            errRef.current.focus();
        }
    }
    return (
        <>
            {success ? (
                <section className="email-reg">
                    <h1>Дякую за реєстрацію!</h1>
                    <p>
                        На ваш email було відправлено лист з підтвердженням. Коли ви підтверите email, ви зможете <a href="/login"> залогінитись</a>
                    </p>
                </section>
            ) : (
                <section className='registration'>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Реєстрація</h1>
                    <form onSubmit={handleSubmit}>
                        <label className="form_label" htmlFor="username">
                            Логін:
                            <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="form__field"
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4-24 символи. Починається з літери. Дозволено: літери, числа, _ , -
                        </p>
                        <label className="form_label" htmlFor="email">
                            Елекронна пошта:
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="form__field"
                            type="text"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Ваша пошта для підтвердження.
                        </p>
                        <label className="form_label" htmlFor="full-name">
                            Ваше ім'я або нікнейм:
                            <FontAwesomeIcon icon={faCheck} className={validFullName ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validFullName || !fullName ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="form__field"
                            type="text"
                            id="full-name"
                            autoComplete="off"
                            onChange={(e) => setFullName(e.target.value)}
                            value={fullName}
                            required
                            aria-invalid={validFullName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setFullNameFocus(true)}
                            onBlur={() => setFullNameFocus(false)}
                        />
                        <p id="uidnote" className={fullNameFocus && fullName && !validFullName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Тут напишіть як до вас звертатись.
                        </p>
                        <label className="form_label" htmlFor="password">
                            Пароль:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="form__field"
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8-24 символи. Містить маленькі і великі літери, число, і:
                            <span aria-label="exclamation mark"> ! </span>
                            <span aria-label="at symbol">@ </span>
                            <span aria-label="hashtag"># </span>
                            <span aria-label="dollar sign">$ </span>
                            <span aria-label="percent">%</span>
                        </p>


                        <label className="form_label" htmlFor="confirm_pwd">
                            Підтвердіть пароль:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            className="form__field"
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Повинен збігатись з полем вище.
                        </p>
                        <button disabled={!validName || !validPwd || !validMatch || !validEmail || !validFullName || isLoading ? true : false}>{isLoading ? <SpinnerLoading /> : 'Зареєструватись'}</button>
                    </form>
                    <p>
                        Вже зареєстровані? <a href="/login">Залогінитись</a>
                    </p>
                </section>
            )}
        </>
    )
}
export default Register;