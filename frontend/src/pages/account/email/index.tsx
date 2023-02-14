import {useAppSelector} from '@redux/hooks/useRedux';
import Summary from '@components/summary/Style1';

const Email = () => {

    const {user} = useAppSelector(state => state.user);


    return (
        <Summary title={user?.email || "email"}>

        </Summary>
    )
}

export default Email