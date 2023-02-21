import { useEffect, useState } from 'react';
import { useAppDispatch } from '@redux/hooks/useRedux';
import Alert from '@redux/actions/alert';

const AlertContainer = () => {
    const dispatch = useAppDispatch();

    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        // Update network status
        const handleStatusChange = () => setIsOnline(navigator.onLine);
        // Listen to the online status
        window.addEventListener('online', handleStatusChange);
        // Listen to the offline status
        window.addEventListener('offline', handleStatusChange);
        // Specify how to clean up after this effect for performance improvment
        return () => {
          window.removeEventListener('online', handleStatusChange);
          window.removeEventListener('offline', handleStatusChange);
        };
    }, [isOnline]);

    useEffect(() => {
        let interval: any = "";
        if(!isOnline) interval = setInterval(() => dispatch(Alert.set("No internet connection", "red")), 3000);
        return () => clearInterval(interval);
    }, [isOnline, dispatch])

    return (null)
}

export default AlertContainer