import logo from '../assets/images/navbar/anonymous-guy-fawkes-mask.png'

const Header = () =>{
    return (
        <nav className="navbar">
            <img src={logo} alt='logo' height={40}/>
            <p>My own USOF(here must be name)</p>
            <div className='nav-bar-auth'>
                <a href="/login">Логін</a>
                <a href="/registration">Реєстрація</a>
            </div>
            
        </nav>
    )
}
export default Header;