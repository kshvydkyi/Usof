import jotaro from '../assets/images/pricols/Jotaro-PNG-Photos.png'

const NotFound = () =>{
    return (
        <>
        <div className='not-found-page'>
            <p>Гей козаче, схоже що цієї сторінки не існує. Введи щось нормальне у пошуковий рядок наступного разу</p>
            <img src={jotaro} height={500}alt='not found'/>
        </div>

        </>
    )
}
export default NotFound;