import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import route from "../api/route";
import { fetchUsers } from "../slices/postSlice";
import kavun from '../assets/images/likes/likeActivePicture.png'


const Pages = ({ totalPages }) => {
	let pages = [];
	for (let i = 1; i <= totalPages; i++) {
		pages.push(<li key={i}><a className='pages' href={`/users?page=${i}`}>{i}</a></li>)
	}
	return pages;
}
const Users = () => {


    const { search, pathname } = useLocation();
    const id = pathname.split('/');
    const page = search.split('=');
    const dispatch = useDispatch();

    const users = useSelector((state) => state.posts.allUsers)
    const totalPages = useSelector((state) => state.posts.allUsersPages);
    //console.log(users);
    useEffect(() => {
        dispatch(fetchUsers({page: page[1]}))    
    }, [])
    return (
        <>
           {users && users.length > 0  ? users.map((user) => {
            return(
            <div className="users-page">
                <div className='user-page-userInfo'>
                    <div className="flex1">
                        <a href={`/user/${user.id}`}className="user-page-login">{user.login}</a>
                        <p className="post-publish-date role">{user.role}</p>
                    </div>
                    <div className="flex">
                        <div className="flex">
                            <img src={user.photo && user.photo !== 'undefined' ? `${route.serverURL}/avatars/${user.photo}` : <></>} alt='user' width={120} height={120} />
                            
                           
                            <div>
                                <div className="flex flex1">
                                    <p className="full-name-profile">{user.full_name} </p>
                                    <img height={20} className="rating" src={kavun} alt='' />
                                    <p>{user.rating}</p>
                                </div>
                               
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
                </div>
                )
           }) : <></>}
           <div>
				<ul className="none inline">
					<Pages totalPages={totalPages} />
				</ul>
			</div>
		
        </>
    )
}

export default Users;

