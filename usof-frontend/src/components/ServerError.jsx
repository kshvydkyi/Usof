import mysticalTree from '../assets/images/pricols/500.jpg'

const ServerError = () =>{
    return (
        <>
        <div className='server-error-page'>
            <p className='serverError'>505 iternal server error</p>
            <p className='serverError'>Своїми діями ви розгнівали мудре містичне дерево. На цей раз, адміни все владнають. Але наступного разу поводьтесь чемно</p>
            <img src={mysticalTree} height={500} alt='not found'/>
            
        </div>

        </>
    )
}
export default ServerError;