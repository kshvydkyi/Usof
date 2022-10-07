import '../css/App.css';
import Register from './Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import ConfirmEmail from './ConfirmEmail';
import WelcomePage from './WelcomePage';
import Header from './Header';
import Posts from './Posts';
import ResetPassword from './ResetPassword';
import ResetPasswordWT from './ResetPasswordWT';
import NotFound from './NotFound';

function App() {
  return (
    <BrowserRouter>
      <header>
       <Header />
      </header>
      <main className='App'>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          
          {/* Auth module */}
          <Route path="/registration" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/reset-password/:confirm_token' element={<ResetPasswordWT />} />
          <Route path="/*" element={<NotFound />} />
          <Route path='/posts' element={<Posts />} />
          
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
