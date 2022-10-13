import { useLocation, Navigate, Outlet } from "react-router-dom";


const RequreAuth = ( {allowedRoles} ) =>{
    const location = useLocation();
    const currentUser = JSON.parse(localStorage.getItem('autorized'));
    return(
        allowedRoles?.includes(currentUser?.role) 
        ? <Outlet /> 
        : currentUser?.user 
            ? <Navigate to='/unauthorized' state={{from: location}} replace />
            : <Navigate to='/login' state={{from: location}} replace />
    )
}

export default RequreAuth;