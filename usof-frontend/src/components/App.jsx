import '../css/App.css';
import '../css/index.scss'
import Register from './Register';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import ConfirmEmail from './ConfirmEmail';
import WelcomePage from './WelcomePage';
import Posts from './Posts';
import ResetPassword from './ResetPassword';
import ResetPasswordWT from './ResetPasswordWT';
import NotFound from './NotFound';
import Layout from './Layout';
import Admin from './Admin';
import User from './User';
import RequreAuth from './RequireAuth';
import Unauthorized from './Unauthorized';
import CreatePost from './CreatePost';

function App() {
	if (!localStorage.getItem('autorized')) {
		localStorage.setItem(
		  'autorized',
		  JSON.stringify({ currentUser: 'guest' })
		);
	  }
	return (
		<Routes>
			<Route path="/" element={<Layout />} >
				{/* Auth module */}
				<Route path='/' element={<WelcomePage />} />
				<Route path="registration" element={<Register />} />
				<Route path="login" element={<Login />} />
				<Route path="confirm-email/:token" element={<ConfirmEmail />} />
				<Route path='reset-password' element={<ResetPassword />} />
				<Route path='reset-password/:confirm_token' element={<ResetPasswordWT />} />
				<Route path='unauthorized' element={<Unauthorized/>} />
				<Route path='posts' element={<Posts />} />
				{/* only authorized users */}
				<Route element={<RequreAuth allowedRoles={['User', 'Admin']}/>} >
					<Route path='user' element={<User />} />
					<Route path='create-post' element={<CreatePost />} />
					</Route>
				<Route element={<RequreAuth allowedRoles={['Admin']}/>} >
					<Route path='admin' element={<Admin />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	);
}

export default App;
