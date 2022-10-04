import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useNavigate } from "react-router-dom";
import axios from '../api/axios';

const URL = `/api/auth/active/`;

const ConfirmEmail = () =>{
    const {token} = useParams();
    const [active, setActive] = useState('Зараз чекаємо на активацію пошти');
    const navigate = useNavigate();
    useEffect(()=>{
         const fetch = async () => {
            console.log('AVAV');
            try{
                await axios.get(URL + token);
                setActive("Активація успішна, ви зможете залогінитись через декілька секунд");
                setTimeout(()=> navigate('/login'), 5000);
            }
            catch(e){
                console.log(e);
                setActive("ЛОХ, РЕЄСТРУЙСЯ ЗАНОВО АХАХАХХАХАХХА");

            }
            
        }
        fetch();
        
    }, []);
 return(
    <p>{active}</p>
 )
}

export default ConfirmEmail;