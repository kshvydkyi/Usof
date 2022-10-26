import Header from './Header';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <>
        <header>
            <Header  />
        </header>
    
        <main className="App">
     
            {/* <div className="components"> */}
             
                {/* <div className='main-block'> */}
                <Outlet />
                {/* </div> */}
            {/* </div> */}
        </main>
    
        </>
    )
}

export default Layout