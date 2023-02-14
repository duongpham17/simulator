import { Link } from 'react-router-dom';
import { useAppSelector } from '@redux/hooks/useRedux';
import { MdAccountCircle } from 'react-icons/md';

const Login = () => {

    const authentication = useAppSelector(state => state.authentication);

    return (
        authentication.isLoggedIn ? 
            <Link to="account"><MdAccountCircle/></Link>
            :
            <Link to="login">Login</Link>
    )
}

export default Login