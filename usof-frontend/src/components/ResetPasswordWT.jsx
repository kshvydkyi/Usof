import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import SpinnerLoading from "./Spinner";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const RESETPASS_URL = `/api/auth/password-reset/`;
const ResetPasswordWT = () =>{
    const errRef = useRef();
    const {confirm_token} = useParams();
    const navigate = useNavigate();

    const [pwd, setPwd] = useState('');

    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [isLoading, setLoading] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = PWD_REGEX.test(pwd);
        if (!v) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(RESETPASS_URL + confirm_token,
                JSON.stringify({password: pwd, confirmPassword: matchPwd}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data.status, response?.data.values.message);
            setSuccess(true);
            setLoading(false);
            setTimeout(()=> navigate('/login'), 5000);
        }
        catch (err) {
            setLoading(false);
            console.log(err);
            if (!err?.response) {
                setErrMsg('Сервер спить, вибачте');
            }
            else {
                setErrMsg('Шось не так. Схоже що час для відновлення паролю сплив. Спробуйте ще раз');
                setTimeout(()=> navigate('/reset-password'), 5000);
            }
            errRef.current.focus();
        }
    }
    return(
        <>
        {success ? (
            <section className="email-reg">
                <h1>Ваш пароль відновлено</h1>
                <br></br>
                <p>Ви зможете залогінитись через декілька секунд</p>
            </section>
        ) : (
            <section className="reset-passSection">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Відновлення паролю</h1>
                <form onSubmit={handleSubmit}>
                    <label className="form_label " htmlFor="password">
                        Новий пароль:
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
                    <button disabled={!validPwd || !validMatch || isLoading ? true : false}>{isLoading ? <SpinnerLoading /> : 'Відновити пароль'}</button>
                </form>
            </section>
        )}
    </>
    )
}

export default ResetPasswordWT;