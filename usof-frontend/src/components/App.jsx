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
import ServerError from './ServerError';
import ChangeProfile from './ChangeProfile';
import ChangeUserAvatar from './ChangeUserAvatar';
import Post from './Post';
import UpdateComent from './UpdateComent';

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
				<Route path='user/:userId' element={<User />} />
				<Route path='post/:postId' element={<Post/>} />
				{/* only authorized users */}
				<Route element={<RequreAuth allowedRoles={['User', 'Admin']}/>} >
					<Route path='create-post' element={<CreatePost />} />
					<Route path='change-profile' element={<ChangeProfile />} />
					<Route path='change-avatar' element={<ChangeUserAvatar/>}/>
					<Route path='update-coment/:comentId' element={<UpdateComent/>} />
					</Route>
				<Route element={<RequreAuth allowedRoles={['Admin']}/>} >
					<Route path='admin' element={<Admin />} />
				</Route>
				<Route path="*" element={<NotFound />} />
				<Route path='500' element={<ServerError />} />
			</Route>
		</Routes>
	);
}

export default App;
