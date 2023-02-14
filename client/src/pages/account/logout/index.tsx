import { useAppDispatch } from '@redux/hooks/useRedux';
import authentication from '@redux/actions/authentication';
import Button from '@components/buttons/Button';
import { MdLogout } from 'react-icons/md';

const Logout = () => {
  
  const dispatch = useAppDispatch();

  return (
    <Button label1="Logout" label2={<MdLogout/>} onClick={() => dispatch(authentication.logout)} color="red"/>
  )

};

export default Logout;