import styles from './Account.module.scss';
import React from 'react';
import Logout from './logout';
import Email from './email';

const Account = () => {

    const Box = ({children}: {children: React.ReactNode}) => (
        <div className={styles.box}>
            {children}
        </div>
    )

    return (
        <div className={styles.container}>

            <Box>
                <Logout />
            </Box>

            <Box>
                <Email />
            </Box>
            
        </div>
    )
}

export default Account