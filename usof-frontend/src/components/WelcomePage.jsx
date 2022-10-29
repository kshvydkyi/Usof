import logo from '../assets/images/navbar/logo.png'

const WelcomePage = () => {
    return (
        <>
            <div className='welcome-page'>
                <div className='welcome-page-head'>
                    <h1 className='welcome-page-h1'>Базований</h1>
                    <img src={logo} height={40} alt='logo' />
                </div>
            </div>
        </>
    )
}

export default WelcomePage;