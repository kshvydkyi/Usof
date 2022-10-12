import logo from '../assets/images/navbar/anonymous-guy-fawkes-mask.png'

const Header = () =>{
    return (
        <div className="wrapper-navbar">
        <nav className="navbar">
            <a href='/posts/?page=1'><img src={logo} alt='logo' height={40}/></a>
            <p>My own USOF(here must be name)</p>
            <div className='nav-bar-auth'>
                <a href="/login">Логін</a>
                <a href="/registration">Реєстрація</a>
            </div>
            
        </nav>
        </div>
    )
}
export default Header;