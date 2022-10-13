import { useNavigate } from "react-router-dom";

const Unauthorized = () => {

    const navigate = useNavigate();

    const goBack = () => navigate(-1);
    return(
        <section>
        <h1>У доступі відмовлено</h1>

        <p>Скоріш за все ви не авторизовані, або намагаєтесь потрапити на стрінку з адмінськими функціями без доступу</p>

        <button onClick={goBack}>Назад</button>
        </section>
    )
}

export default Unauthorized;
