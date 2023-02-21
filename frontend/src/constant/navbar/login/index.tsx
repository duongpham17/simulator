import { useAppSelector } from '@redux/hooks/useRedux';
import { MdAccountCircle } from 'react-icons/md';
import LinksContainer from '@components/link/Style1'

const Login = () => {

    const authentication = useAppSelector(state => state.authentication);

    const data = [{
        name: authentication.isLoggedIn ? <MdAccountCircle/> : "Login",
        to: authentication.isLoggedIn ? "/account" : "/login"
    }]

    return ( <LinksContainer data={data} />)
}

export default Login