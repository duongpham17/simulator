import {useState, useEffect} from 'react';

interface Props {
    seconds: number,
    dependency?: any
}

const useFetching = ({dependency, seconds = 10}: Props) => {

    const [fetching, setFetching] = useState(true);

    const [looped, setLooped] = useState(0);

    useEffect(() => {
        if(!fetching) return;
        if(looped >= (seconds * 2)) return setFetching(false);

        let interval = setInterval(() => {
            if(dependency) setFetching(false);
            setLooped(looped => looped + 1);
        }, 500)

        return () => clearInterval(interval);

    }, [dependency, fetching, looped, seconds])    

    return {
        fetching
    }
}

export default useFetching