import useQuery from '@hooks/useQuery';

import { localSet } from '@utils/localstorage';

import Button from '@components/buttons/Button';

const Environment = () => {

    const {setQuery, getQueryValue} = useQuery();

    const environment = getQueryValue("environment") === "live" ? "test" : "live";

    const onClick = () => {
        setQuery("environment", environment);
        localSet("orders-environment", environment)
    };

    return (
        <Button label1={"Environment"} label2={environment === "live" ? "Test" : "Live"} onClick={onClick} color="light" />
    )
}

export default Environment