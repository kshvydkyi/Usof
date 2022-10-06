import '../App.css';
import Register from './Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import ConfirmEmail from './ConfirmEmail';
import WelcomePage from './WelcomePage';
function App() {
  return (
    <BrowserRouter>
      <header>
        <p>PRICOL</p>
      </header>
      <main className='App'>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/registration" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
