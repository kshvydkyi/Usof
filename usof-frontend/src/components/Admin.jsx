import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import SpinnerLoading from "./Spinner";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const FULLNAME_REGEX = /^['а-яА-ЯїЇґҐіІєЄa-zA-Z\s]{2,24}$/



const Admin = () => {
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

    const [role, setRole] = useState('');
    const [validRole, setValidRole] = useState(false);
    const [roleFocus, setRoleFocus] = useState(false);


    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [isLoading, setLoading] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('autorized'));
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
        if (role === 'User' || role === 'Admin') {
            setValidRole(true);
        }
        else {
            setValidRole(false)
        }
    }, [role]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);
    const createNewUser = async (e) => {
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
            const response = await axios.post(`/api/users/${currentUser.accessToken}`,
                JSON.stringify({ login: user, email: email, fullName: fullName, password: pwd, passwordConfirmation: matchPwd, role: role }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // console.log(response?.data.status, response?.data.values.message);
            setSuccess(true);
            setLoading(false);
            // document.location.reload();
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
    const [deleteUserId, setDeleteUserId] = useState(0)
    const deleteUser = async () => {
        try {
            // console.log(deleteUserId);
            const response = await axios.delete(`/api/users/${deleteUserId}/${currentUser.accessToken}`);
            // console.log(response);
        }
        catch (e) {
            // console.log(e);
        }
    }

    const [statusPost, setStatusPost] = useState('');
    const [validStatusPost, setValidStatusPost] = useState('');
    useEffect(() => {
        if (statusPost === 'active' || statusPost === 'inactive') {
            setValidStatusPost(true);
        }
        else {
            setValidStatusPost(false)
        }
    }, [statusPost])

    const [postId, setPostId] = useState(0);
    const setStatus = async () => {
        try {
            const response = await axios.patch(`/api/admin/posts/set-status/${postId}/${currentUser.accessToken}`, JSON.stringify({status: statusPost}))
            // console.log(response);
        }
        catch (e) {
            // console.log(e);
        }
    }
    return (
        <>
            <div className="admin-page-container">
                <p>Модуль користувачів</p>
                <div className="user-module">

                    <section className='registration create-new-user'>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <h2>Створити нового користувача</h2>
                        <form onSubmit={() => createNewUser()}>
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
                                Пошта.
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
                            <label className="form_label" htmlFor="role">
                                Роль:
                                <FontAwesomeIcon icon={faCheck} className={validRole ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validRole || !role ? "hide" : "invalid"} />
                            </label>
                            <input
                                className="form__field"
                                type="text"
                                id="role"
                                autoComplete="off"
                                onChange={(e) => setRole(e.target.value)}
                                value={role}
                                required
                                aria-invalid={validRole ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setRoleFocus(true)}
                                onBlur={() => setRoleFocus(false)}
                            />
                            <p id="uidnote" className={roleFocus && role && !validRole ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Роль: Admin або User.
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
                                Підтвердження паролю:
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
                            <button disabled={!validName || !validPwd || !validMatch || !validEmail || !validFullName || isLoading ? true : false}>{isLoading ? <SpinnerLoading /> : 'Створити користувача'}</button>
                        </form>
                    </section>
                    <section className="registration create-new-user">
                        <h2>Видалити користувача</h2>
                        <form onSubmit={() => deleteUser()}>
                            <label className="form_label" htmlFor="deleteUserId">Id користувача</label>
                            <input
                                className="form__field"
                                type="number"
                                id="deleteUserId"
                                onChange={(e) => setDeleteUserId(e.target.value)}
                                value={deleteUserId}
                                required
                                min={0}
                            />
                            <button>Видалити користувача</button>
                        </form>
                    </section>
                </div>
                <div>
                    <p>Модуль постів</p>
                    <section className="registration create-new-user">
                        <form onSubmit={() => setStatus()}>
                            <label className="form_label" htmlFor="setStatus">
                                Встановити статус публікації
                                <FontAwesomeIcon icon={faCheck} className={validStatusPost ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validStatusPost ? "hide" : "invalid"} />
                            </label>
                            <input
                                className="form__field"
                                type="text"
                                id="setStatus"
                                autoComplete="off"
                                onChange={(e) => setStatusPost(e.target.value)}
                                value={statusPost}
                                required
                            />
                            <label className="form_label" htmlFor="postId">Id публікації</label>
                            <input
                                className="form__field"
                                type="number"
                                id="postId"
                                autoComplete="off"
                                onChange={(e) => setPostId(e.target.value)}
                                value={postId}
                                required
                                min={0}
                            />
                            <button>Встановити статус</button>
                        </form>
                    </section>
                </div>
                <div>
                    <p>Модуль категорій</p>
                </div>
                <div>
                    <p>Модуль коментарів</p>
                </div>

            </div>
        </>
    )
}

export default Admin;